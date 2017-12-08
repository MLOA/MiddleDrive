using System;
using System.Data.SQLite;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Windows.Devices.Bluetooth.Rfcomm;
using Windows.Networking.Sockets;
using Windows.Storage.Streams;

namespace MiddleDriveServer {
    class BluetoothServer {
        RfcommServiceProvider _provider;
        DataReader reader;
        DataWriter writer;
        String dbName = "Data Source=middle_drive.db";

        public async Task init() {
            createDB();
            await initBluetoothServer();
            initHttpServer();
            Console.WriteLine("Server start");
        }

        void createDB() {
            var con = new SQLiteConnection(dbName);
            con.Open();
            var cmd = con.CreateCommand();
            cmd.CommandText = "CREATE TABLE IF NOT EXISTS text(ID INTEGER PRIMARY KEY AUTOINCREMENT, datetime INT, line TEXT) ";
            cmd.ExecuteNonQuery();
            con.Close();
        }

        async Task initBluetoothServer() {
            _provider = await RfcommServiceProvider.CreateAsync(RfcommServiceId.ObexObjectPush);
            StreamSocketListener listener = new StreamSocketListener();
            listener.ConnectionReceived += OnConnectionReceived;
            await listener.BindServiceNameAsync(_provider.ServiceId.AsString(), SocketProtectionLevel.BluetoothEncryptionAllowNullAuthentication);
            _provider.StartAdvertising(listener);
        }

        void OnConnectionReceived(StreamSocketListener listener, StreamSocketListenerConnectionReceivedEventArgs args) {
            var _socket = args.Socket;
            reader = new DataReader(_socket.InputStream);
            reader.UnicodeEncoding = Windows.Storage.Streams.UnicodeEncoding.Utf8;
            writer = new DataWriter(_socket.OutputStream);
            writer.UnicodeEncoding = Windows.Storage.Streams.UnicodeEncoding.Utf8;
            Console.WriteLine("connected");
            receive();
        }

        async void initHttpServer() {
            // サーバの開始
            HttpListener httplistener = new HttpListener();
            httplistener.Prefixes.Add("http://localhost:8000/");
            httplistener.Start();

            //接続処理
            while (true) {
                var context = httplistener.GetContext();
                var res = context.Response;
                var req = context.Request;
                var param = new StreamReader(req.InputStream, Encoding.GetEncoding("utf-8")).ReadToEnd();
                await send(param);
                res.StatusCode = 200;
                res.Close();
            }
        }

        async Task send(String text) {
            var buff = Encoding.UTF8.GetBytes(text);
            writer.WriteInt32(buff.Length);
            writer.WriteString(text);
            await writer.StoreAsync();
        }

        async void receive() {
            while (true) {
                //読み出し
                await reader.LoadAsync(sizeof(int));
                var length = reader.ReadInt32();
                await reader.LoadAsync((uint)length);
                var text2 = reader.ReadString((uint)length);
                Console.WriteLine("R:" + text2);

                //DBに保存
                var con = new SQLiteConnection(dbName);
                con.Open();
                var cmd = con.CreateCommand();
                cmd.CommandText = "INSERT INTO text (datetime, line) VALUES (@p_datetime, @p_line)";
                var time = DateTime.Now.ToString("yyyyMMddHHmmssfff");
                cmd.Parameters.Add(new SQLiteParameter("@p_datetime", time));
                cmd.Parameters.Add(new SQLiteParameter("@p_line", text2));
                cmd.ExecuteNonQuery();
                con.Close();
            }
        }
    }
}
