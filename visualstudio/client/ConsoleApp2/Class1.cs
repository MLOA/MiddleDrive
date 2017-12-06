﻿using System;
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

        async void receive() {
            try {
                Console.WriteLine("受信待ちを開始します");
                var res = await reader.LoadAsync(30);
                var text2 = reader.ReadString(30);
                Console.WriteLine("R:" + text2);
                receive();
            } catch (Exception ex) {
                Console.WriteLine("Error: " + ex.Message);
            }
        }
    }
}
