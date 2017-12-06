using System;
using System.Threading.Tasks;
using Windows.Devices.Bluetooth.Rfcomm;
using Windows.Networking.Sockets;
using Windows.Storage.Streams;

namespace MiddleDriveServer {
    class BluetoothServer {

        RfcommServiceProvider _provider;
        DataReader reader;
        DataWriter writer;

        public async Task init() {
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

        void OnConnectionReceived(
            StreamSocketListener listener,
            StreamSocketListenerConnectionReceivedEventArgs args) {
            Console.WriteLine("connected");

            var _socket = args.Socket;
            reader = new DataReader(_socket.InputStream);
            writer = new DataWriter(_socket.OutputStream);
            receive();
            sendHello();
        }

        async void send() {
            var text = Console.ReadLine();
            Console.WriteLine("W:" + text);
            if (text.Length < 30) {
                text = text.PadRight(30, '*');
            } else {
                text = text.Substring(0, 30);
            }
            writer.WriteString(text);
            await writer.StoreAsync();
            send();
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
            send();
        }

        async void receive() {
            var res = await reader.LoadAsync(30);
            var text2 = reader.ReadString(30);
            Console.WriteLine("R:" + text2);
            receive();
        }

    }
}
