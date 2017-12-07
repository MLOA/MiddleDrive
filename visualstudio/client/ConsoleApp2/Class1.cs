using System;
using System.Data.SQLite;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Windows.Devices.Bluetooth;
using Windows.Devices.Bluetooth.Rfcomm;
using Windows.Devices.Enumeration;
using Windows.Networking.Sockets;
using Windows.Storage.Streams;

namespace ConsoleApp2 {
    class BluetoothClient {
        RfcommDeviceService _service;
        StreamSocket _socket;
        DataWriter writer;
        DataReader reader;
        String dbName = "Data Source=middle_drive.db";

        public async Task init() {
            using (var con = new SQLiteConnection(dbName)) {
                con.Open();

                using (var cmd = con.CreateCommand()) {
                    cmd.CommandText = "CREATE TABLE IF NOT EXISTS text(ID INTEGER PRIMARY KEY AUTOINCREMENT, datetime INT, line TEXT) ";
                    cmd.ExecuteNonQuery();
                }
            }

            var informations = await DeviceInformation.FindAllAsync(BluetoothDevice.GetDeviceSelector());

            foreach (var info in informations) {
                Console.WriteLine(info.Name);
            }

            if (informations.Count == 0) {
                Console.WriteLine("デバイスが見つかりません");
                return;
            }

            var bluetoothDevice = await BluetoothDevice.FromIdAsync(informations[0].Id);
            var rfcommServices = await bluetoothDevice.GetRfcommServicesAsync();

            if (rfcommServices.Services.Count == 0) {
                Console.WriteLine("サービスがみつかりません");
                return;
            }

            _service = rfcommServices.Services[0];

            var services =
            await DeviceInformation.FindAllAsync(
                RfcommDeviceService.GetDeviceSelector(
                    RfcommServiceId.ObexObjectPush));

            if (services.Count != 0) {
                _service = await RfcommDeviceService.FromIdAsync(services[0].Id);
            } else {
                Console.WriteLine("サービスが見つかりませんでした");
                return;
            }

            _socket = new StreamSocket();

            await _socket.ConnectAsync(_service.ConnectionHostName, _service.ConnectionServiceName, SocketProtectionLevel.BluetoothEncryptionAllowNullAuthentication);
            writer = new DataWriter(_socket.OutputStream);
            reader = new DataReader(_socket.InputStream);
            Console.WriteLine(_service.ConnectionHostName.ToString());
            Console.WriteLine("connected");
            receive();

            try {
                HttpListener httplistener = new HttpListener();
                httplistener.Prefixes.Add("http://localhost:8000/");
                httplistener.Start();
                while (true) {
                    var context = httplistener.GetContext();
                    var res = context.Response;
                    var req = context.Request;
                    var param = "";
                    using (var reader = new StreamReader(req.InputStream, Encoding.GetEncoding("utf-8"))) {
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

        async Task send(String text) {
            var buff = Encoding.UTF8.GetBytes(text);
            writer.WriteInt32(buff.Length);
            writer.WriteString(text);
            await writer.StoreAsync();
        }

        async void receive() {
            try {
                await reader.LoadAsync(sizeof(int));
                var length = reader.ReadInt32();
                await reader.LoadAsync((uint)length);
                var text2 = reader.ReadString((uint)length);

                //var res = await reader.LoadAsync(30);
                //var text2 = reader.ReadString(30);
                Console.WriteLine("R:" + text2);
                using (var con = new SQLiteConnection(dbName)) {
                    con.Open();

                    using (var cmd = con.CreateCommand()) {
                        cmd.CommandText = "INSERT INTO text (datetime, line) VALUES (@p_datetime, @p_line)";
                        var time = DateTime.Now.ToString("yyyyMMddHHmmssfff");
                        cmd.Parameters.Add(new SQLiteParameter("@p_datetime", time));
                        //text2 = Encoding.UTF8.GetString(Encoding.GetEncoding("").GetBytes(text2));
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
