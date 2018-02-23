import * as http from "http";
import * as sio from "socket.io";
import * as nodeStatic from "node-static";

export class App {

	private PORT:number = 55000;

	public run(): void {
		var server: http.Server = http.createServer();
		var io: SocketIO.Server = sio(server);

		io.on("connection", (client)=> {
			console.log("CONNECTED");
		});

		server.listen(this.PORT, () => {
			console.log("Listening on " + this.PORT);
		});
	}
}

export default App;