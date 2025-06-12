import lighthouse from '@lighthouse-web3/sdk';
import { LIT_NETWORK } from "@lit-protocol/constants";
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ethers } from "ethers";
import { createSiweMessageWithRecaps, generateAuthSig, LitAbility, LitAccessControlConditionResource } from "@lit-protocol/auth-helpers";
import { WalletClient } from 'viem';
import { useWalletClient } from 'wagmi';

function HandleIpfs() {
    const { data: walletClient } = useWalletClient(); // ✅ moved here

    function useEthersSigner(): (() => Promise<ethers.JsonRpcSigner | undefined>) {
        return async () => {
            if (!walletClient) return undefined;

            const provider = new ethers.BrowserProvider(walletClient.transport as any);
            return await provider.getSigner();
        };
    }

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
                const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
                    {
                        //@ts-ignore
                        accessControlConditions,
                        dataToEncrypt: message,
                    },
                    this.litNodeClient,
                );

                return {
                    ciphertext,
                    dataToEncryptHash,
                };
            }
        }

        const chain = "sepolia";
        let myLit = new Lit(chain);
        await myLit.connect();
        console.log("connected successfully");

        const accessControlConditions = [
            {
                contractAddress: "",
                standardContractType: "",
                chain: "ethereum",
                method: "eth_getBalance",
                parameters: [":userAddress", "latest"],
                returnValueTest: {
                    comparator: ">=",
                    value: "1000000000000",
                },
            },
        ];

        const { ciphertext, dataToEncryptHash } = await myLit.encrypt("hello there, there goes the test string");

        console.log("ciphertext", ciphertext);
        console.log("dataToEncryptHash", dataToEncryptHash);

        //this is my signer
        const getSigner = useEthersSigner();

        //handles getting signer from wallet connect
        const handleAction = async () => {
            const signer = await getSigner();
            if (!signer) {
                console.error("No signer found");
                return;
            }

            const address = await signer.getAddress();
            console.log("Connected address:", address);
        };

        handleAction();

        //preparing accounts resource string

        const accsResourceString = await LitAccessControlConditionResource.generateResourceString(
            //@ts-ignore
            accessControlConditions,
            dataToEncryptHash
        );
        console.log("accsResourceString: ",accsResourceString);

        //generating session signatures:

        

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

            <button onClick={() => useEthersSigner()}>
                Connect Wallet
            </button>
        </div>
    );
}

export default HandleIpfs;
