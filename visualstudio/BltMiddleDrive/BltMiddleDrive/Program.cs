namespace BltMiddleDrive {
    class Program {
        static void Main(string[] args) {
            string[] cmds = System.Environment.GetCommandLineArgs();
            var bltModule = new BluetoothModule();
            if(cmds.Length > 1) bltModule.Init(cmds[1] == "-server").Wait();
            else bltModule.Init(false).Wait();
        }
    }
}