using System;
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

        public async Task init() {
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
            Console.WriteLine("メッセージを入力してください");
            receive();
            send();
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

        async void receive() {
            Console.WriteLine("受信待ちを開始します");
            var res = await reader.LoadAsync(30);
            var text2 = reader.ReadString(30);
            Console.WriteLine("R:" + text2);
            receive();
        }
    }
}
