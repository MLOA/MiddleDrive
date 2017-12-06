using System;
using System.Threading.Tasks;
using Windows.Devices.Bluetooth.Rfcomm;
using Windows.Networking.Sockets;
using Windows.Storage.Streams;

namespace ConsoleApp3 {
    class BluetoothServer {

        RfcommServiceProvider _provider;

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

        async void OnConnectionReceived(
            StreamSocketListener listener,
            StreamSocketListenerConnectionReceivedEventArgs args) {
            Console.WriteLine("connected");

            //_provider.StopAdvertising();
            //await listener.Close();
            var _socket = args.Socket;
            var reader = new DataReader(_socket.InputStream);
            while (true) {
                var res = await reader.LoadAsync(30);
                var text2 = reader.ReadString(30);
                Console.WriteLine("R:" + text2);
            }
        }
    }
}
