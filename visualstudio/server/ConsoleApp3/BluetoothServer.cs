using System;
using System.Data.SQLite;
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
                    cmd.CommandText = "CREATE TABLE IF NOT EXISTS text(ID INTEGER PRIMARY KEY AUTOINCREMENT, datetime DATETIME, line TEXT) ";
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
            Console.WriteLine("W:" + text);
            if (text.Length < 30) {
                text = text.PadRight(30, '*');
            } else {
                text = text.Substring(0, 30);
            }
            writer.WriteString(text);
            await writer.StoreAsync();
        }

        async void sendHello() {
            var text = "Hello";
            Console.WriteLine("W:" + text);
            if (text.Length < 30) {
                text = text.PadRight(30, '*');
            } else {
                text = text.Substring(0, 30);
            }
            writer.WriteString(text);
            await writer.StoreAsync();

            try {
                HttpListener httplistener = new HttpListener();
                httplistener.Prefixes.Add("http://localhost:8000/");
                httplistener.Start();
                while (true) {
                    HttpListenerContext context = httplistener.GetContext();
                    HttpListenerResponse res = context.Response;
                    var message = context.Request.RawUrl.TrimStart('/');
                    await send(message);
                    res.StatusCode = 200;
                    byte[] content = Encoding.UTF8.GetBytes(message);
                    res.OutputStream.Write(content, 0, content.Length);
                    res.Close();
                }
            } catch (Exception ex) {
                Console.WriteLine("Error: " + ex.Message);
            }
        }

        async void receive() {
            try {
                var res = await reader.LoadAsync(30);
                var text2 = reader.ReadString(30);
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
