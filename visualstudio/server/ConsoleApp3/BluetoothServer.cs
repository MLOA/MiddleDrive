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
            using (var con = new SQLiteConnection(dbName)) {
                con.Open();

                using (var cmd = con.CreateCommand()) {
                    cmd.CommandText = "CREATE TABLE IF NOT EXISTS text(ID INTEGER PRIMARY KEY AUTOINCREMENT, datetime INT, line TEXT) ";
                    cmd.ExecuteNonQuery();
                }
            }

            _provider = await RfcommServiceProvider.CreateAsync(RfcommServiceId.ObexObjectPush);

            StreamSocketListener listener = new StreamSocketListener();
            listener.ConnectionReceived += OnConnectionReceived;

            await listener.BindServiceNameAsync(
                _provider.ServiceId.AsString(),
                SocketProtectionLevel.BluetoothEncryptionAllowNullAuthentication);

            _provider.StartAdvertising(listener);
            Console.WriteLine("Server start");
            while (true) { };
        }

        void OnConnectionReceived(StreamSocketListener listener, StreamSocketListenerConnectionReceivedEventArgs args) {
            Console.WriteLine("connected");
            var _socket = args.Socket;
            reader = new DataReader(_socket.InputStream);
            writer = new DataWriter(_socket.OutputStream);
            receive();
            sendHello();
        }

        async Task send(String text) {
            var buff = Encoding.UTF8.GetBytes(text);
            writer.WriteInt32(buff.Length);
            writer.WriteString(text);
            await writer.StoreAsync();
        }

        async void sendHello() {
            var text = "Hello";
            Console.WriteLine("W:" + text);
            var buff = Encoding.UTF8.GetBytes(text);
            writer.WriteInt32(buff.Length);
            writer.WriteString(text);
            await writer.StoreAsync();

            try {
                HttpListener httplistener = new HttpListener();
                httplistener.Prefixes.Add("http://localhost:8000/");
                httplistener.Start();
                while (true) {
                    var context = httplistener.GetContext();
                    var res = context.Response;
                    var req = context.Request;
                    var param = "";
                    using (var reader = new StreamReader(req.InputStream, req.ContentEncoding)) {
                        param = reader.ReadToEnd();
                    }

                    await send(param);
                    res.StatusCode = 200;
                    res.Close();
                }
            } catch (Exception ex) {
                Console.WriteLine("Error: " + ex.Message);
            }
        }

        async void receive() {
            try {
                await reader.LoadAsync(sizeof(int));
                var length = reader.ReadInt32();
                await reader.LoadAsync((uint)length);
                var text2 = reader.ReadString((uint)length);
                Console.WriteLine("R:" + text2);
                using (var con = new SQLiteConnection(dbName)) {
                    con.Open();

                    using (var cmd = con.CreateCommand()) {
                        cmd.CommandText = "INSERT INTO text (datetime, line) VALUES (@p_datetime, @p_line)";
                        cmd.Parameters.Add(new SQLiteParameter("@p_datetime", DateTime.Now.ToLongTimeString()));
                        cmd.Parameters.Add(new SQLiteParameter("@p_line", text2));
                        cmd.ExecuteNonQuery();
                    }
                }
                receive();
            } catch (Exception ex) {
                Console.WriteLine("Error: " + ex.Message);
            }
        }

    }
}
