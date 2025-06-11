import lighthouse from '@lighthouse-web3/sdk'

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