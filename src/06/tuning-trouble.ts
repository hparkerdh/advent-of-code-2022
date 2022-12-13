import { Startup } from '../util';

export async function run() {
  const context = new Startup('06');
  let startOfPacketMarkers: number[] = [];
  let startOfMessageMarkers: number[] = [];

  await context.readData(line => {
    let startOfPacket: string[] = [];
    let startOfMessage: string[] = [];

    for (let i = 0; i < line.length; i++) {
      startOfPacket.push(line[i]);
      startOfMessage.push(line[i]);
      if (startOfPacket.length == 4) {
        if (startOfPacket.filter((v, indx, self) => self.indexOf(v) == indx).length == 4) {
          startOfPacketMarkers.push(i + 1);
        }
        startOfPacket.shift();
      }
      if (startOfMessage.length == 14) {
        if (startOfMessage.filter((v, indx, self) => self.indexOf(v) == indx).length == 14) {
          startOfMessageMarkers.push(i + 1);
        }
        startOfMessage.shift();
      }
    }
  });

  context.log.info(`The first start-of-packet marker is at position ${startOfPacketMarkers[0]}`);
  context.log.info(`The first start-of-message marker is at position ${startOfMessageMarkers[0]}`);
}
