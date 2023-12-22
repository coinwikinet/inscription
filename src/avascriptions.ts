import { ethers } from "ethers";

// THAY RPC VÀO ĐÂY MAINNET THÌ THAY RPC MAINNET TESTNET THÌ THAY RPC TESTNET
const RPC = "https://api.avax-test.network/ext/bc/C/rpc";

// NẾU KHÔNG GỬI CHO ĐỊA CHỈ NÀO KHÁC KHÔNG CẦN SỬA, MẶC ĐỊNH SẼ GỬI CHO CHÍNH MÌNH
const RECEIVE_ADDRESS: any = null;

// THAY BẰNG MINT TEXT CỦA TOKEN CẦN MINT
const MINT_TEXT = `data:,{"p":"asc-20","op":"mint","tick":"bull","amt":"100000000"}`;

// THAY BẰNG PRIVATE KEY CỦA BẠN
const PRIVATE_KEYS = [
  "thay bằng private key của bạn 1",
  "thay bằng private key của bạn private key 2",
  "thay bằng private key của bạn private key 3",
];

// CẦN CHAY BAO NHIÊU LẦN THÌ THAY SỐ Ở DƯỚI MẶC ĐỊNH LÀ 1
// VÍ DỤ MUỐN MINT MỖI VÍ Ở TRÊN 10 LẦN THÌ THAY BẰNG 10
const LOOP = 2;

// NẾU MINT MÀ CẦN GỬI TIỀN THÌ THAY SỐ Ở DƯỚI CÒN KHÔNG THÌ ĐỂ = 0
// VÍ DỤ CẦN GỬI ĐI 0.0001 AVAX THÌ NHẬP 0.0001
const VALUE = 0;

async function main() {
  try {
    const provider = ethers.providers.getDefaultProvider(RPC);

    for (let j = 0; j < LOOP; j++) {
      for (let i = 0; i < PRIVATE_KEYS.length; i++) {
        try {
          let privateKey = PRIVATE_KEYS[i];
          const wallet = new ethers.Wallet(privateKey, provider);
          let publicKey = wallet.address.toString();
          console.log(`Mint ví ${publicKey} lần thứ ${j + 1}`);

          let feeDataRes: any = await wallet.getFeeData();

          let gasPrice = feeDataRes.gasPrice.toString();
          gasPrice = (Number(gasPrice) * 1.05).toString();

          const buffer = Buffer.from(MINT_TEXT, "utf8");
          const hexData = buffer.toString("hex");

          let txRes: any = await wallet.sendTransaction({
            from: publicKey,
            to:
              RECEIVE_ADDRESS != undefined &&
              RECEIVE_ADDRESS != null &&
              RECEIVE_ADDRESS.trim() != ""
                ? RECEIVE_ADDRESS.trim()
                : publicKey,
            data: `0x${hexData}`,
            value: ethers.utils.parseEther((VALUE || 0).toString()),
          });

          await txRes?.wait();
          console.log("Mint hash -> ", txRes.hash);
        } catch (e) {
          console.log(e);
        }
      }
    }
  } catch (e: any) {
    console.error(e);
  } finally {
    console.log("DONE");
    process.exit(0);
  }
}

main();
