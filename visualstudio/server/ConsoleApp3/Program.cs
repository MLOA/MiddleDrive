namespace ConsoleApp3 {
    class Program {
        static void Main(string[] args) {
            var bltServer = new BluetoothServer();
            bltServer.init().Wait();
        }
    }
}
