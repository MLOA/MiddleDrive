using System;
using System.Diagnostics;
using Windows.Devices.Bluetooth.Rfcomm;
using Windows.Networking.Sockets;
using Windows.Storage.Streams;
using Windows.UI.Xaml.Controls;


namespace App3 {

    public sealed partial class MainPage : Page {
        public MainPage() {
            this.InitializeComponent();
            Initialize();
        }

        RfcommServiceProvider _provider;

        async void Initialize() {
            _provider = await RfcommServiceProvider.CreateAsync(RfcommServiceId.ObexObjectPush);

            StreamSocketListener listener = new StreamSocketListener();
            listener.ConnectionReceived += OnConnectionReceived;
            
            await listener.BindServiceNameAsync(
                _provider.ServiceId.AsString(),
                SocketProtectionLevel.BluetoothEncryptionAllowNullAuthentication);

            _provider.StartAdvertising(listener);
            Debug.WriteLine("Server start");
        }

        async void OnConnectionReceived(
            StreamSocketListener listener,
            StreamSocketListenerConnectionReceivedEventArgs args) {
            Debug.WriteLine("connected");

            _provider.StopAdvertising();
            //await listener.Close();
            var _socket = args.Socket;
            var reader = new DataReader(_socket.InputStream);
            while (true) {
                var res = await reader.LoadAsync(8);
                var text2 = reader.ReadString(8);
                Debug.WriteLine("R:" + text2);
            }
        }
    }
}

