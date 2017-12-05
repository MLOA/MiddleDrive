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

            await SendCommand("start");
            while (true) {
                string text = Console.ReadLine();
                if (text == "quit" || text == "end") break;
                await SendCommand(text);
            }

            writer.Dispose();
            reader.Dispose();
        }

        async Task SendCommand(string text) {
            Console.WriteLine("W:" + text);
            if (text.Length < 30) {
                text = text.PadRight(30, '*');
            } else {
                text = text.Substring(0, 30);
            }
            writer.WriteString(text);
            await writer.StoreAsync();

            try {
                //var res = await reader.LoadAsync(8);
                //var text2 = reader.ReadString(8);
                //Console.WriteLine("R:" + text2);
            } catch (Exception ex) {
                Console.WriteLine(ex.Message);
            }
        }
    }
}
