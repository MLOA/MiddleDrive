namespace ConsoleApp2 {
    class Program {
        static void Main(string[] args) {
            var blt = new BluetoothClient();
            blt.init().Wait();
        }
    }
}
