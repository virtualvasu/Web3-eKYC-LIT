import lighthouse from '@lighthouse-web3/sdk';
import { LIT_NETWORK } from "@lit-protocol/constants";
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import * as LitJsSdk from "@lit-protocol/lit-node-client";

function handleipfs() {

    const progressCallback = (progressData: { uploaded: number; total: number }) => {
        const percentageDone = 100 - (progressData.total / progressData.uploaded);
        console.log(percentageDone.toFixed(2));
    };

    const uploadFile = async (file: File) => {
        const output = await lighthouse.upload(
            [file],
            "62443950.610b75b985a14baf8525bf147a0a4db7",
            //@ts-ignore
            undefined,
            //@ts-ignore
            progressCallback
        );
        console.log("File Status:", output);
        console.log("Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash);

        //LIT class

        class Lit {
            litNodeClient: any;
            chain;

            constructor(chain: any) {
                this.chain = chain;
            }

            async connect() {
                this.litNodeClient = new LitJsSdk.LitNodeClient({
                    litNetwork: "cayenne",
                });
                await this.litNodeClient.connect();
            }

            async encrypt(message: string) {
                // Encrypt the message
                const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
                    {
                        //@ts-ignore
                        accessControlConditions,
                        dataToEncrypt: message,
                    },
                    this.litNodeClient,
                );

                // Return the ciphertext and dataToEncryptHash
                return {
                    ciphertext,
                    dataToEncryptHash,
                };
            }
        }

        const chain = "sepolia";

        let myLit = new Lit(chain);
        await myLit.connect();
        console.log("connected successfully")

        const accessControlConditions = [
            {
                contractAddress: "",
                standardContractType: "",
                chain: "ethereum",
                method: "eth_getBalance",
                parameters: [":userAddress", "latest"],
                returnValueTest: {
                    comparator: ">=",
                    value: "1000000000000", // 0.000001 ETH
                },
            },
        ];

        const { ciphertext, dataToEncryptHash } = await myLit.encrypt("hello there, there goes the test string")

        console.log("ciphertext",ciphertext)
        console.log("dataToEncryptHash",dataToEncryptHash)





        // await myLit.litNodeClient.disconnect()
        // console.log("disconnected scucessfully")



    };


    return (
        <div className="App">
            <input
                type="file"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadFile(file);
                }}
            />

        </div>
    )
}

export default handleipfs