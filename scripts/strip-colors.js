import { NodeIO } from "@gltf-transform/core";
import { KHRDracoMeshCompression } from "@gltf-transform/extensions";
import draco3d from "draco3d";
import { readFileSync, writeFileSync } from "fs";

const [, , input, output] = process.argv;

const decoderModule = await draco3d.createDecoderModule({});
const encoderModule = await draco3d.createEncoderModule({});

const io = new NodeIO()
  .registerExtensions([KHRDracoMeshCompression])
  .registerDependencies({
    "draco3d.decoder": decoderModule,
    "draco3d.encoder": encoderModule,
  });

const document = await io.readBinary(new Uint8Array(readFileSync(input)));

for (const material of document.getRoot().listMaterials()) {
  material.setBaseColorFactor([1, 1, 1, 1]);
}

writeFileSync(output, await io.writeBinary(document));
console.log(`Written → ${output}`);
