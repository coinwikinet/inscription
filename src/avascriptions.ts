import { ethers } from "ethers";

// THAY RPC VÀO ĐÂY MAINNET THÌ THAY RPC MAINNET TESTNET THÌ THAY RPC TESTNET
const RPC = "https://avalanche.blockpi.network/v1/rpc/public";

// NẾU KHÔNG GỬI CHO ĐỊA CHỈ NÀO KHÁC KHÔNG CẦN SỬA, MẶC ĐỊNH SẼ GỬI CHO CHÍNH MÌNH
const RECEIVE_ADDRESS: any = null;

// THAY BẰNG MINT TEXT CỦA TOKEN CẦN MINT
const MINT_TEXT = `data:,{"p":"asc-20","op":"mint","tick":"bull","amt":"100000000"}`;

// THAY BẰNG PRIVATE KEY CỦA BẠN
const PRIVATE_KEYS = [
  "thay bằng private key của bạn 1",
  "thay bằng private key của bạn 2",
];

// CẦN CHAY BAO NHIÊU LẦN THÌ THAY SỐ Ở DƯỚI MẶC ĐỊNH LÀ 1
// VÍ DỤ MUỐN MINT MỖI VÍ Ở TRÊN 10 LẦN THÌ THAY BẰNG 10
const LOOP = 5;

// NẾU MINT MÀ CẦN GỬI TIỀN THÌ THAY SỐ Ở DƯỚI CÒN KHÔNG THÌ ĐỂ = 0
// VÍ DỤ CẦN GỬI ĐI 0.0001 AVAX THÌ NHẬP 0.0001
const VALUE = 0;

// THAY BẰNG GIÁ TRỊ > 1 , CÀNG TO CÀNG NHANH :)
const GAS_INCREASE = 1.09;

async function mint(hexData: any, wallet: any, gasPrice: any) {
  try {
    let publicKey = wallet.address.toString();

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
      gasPrice,
    });

    await txRes?.wait();
    console.log("Mint hash -> ", txRes.hash);
  } catch (e) {
    console.log(e);
  }
}

async function main() {
  try {
    const provider = ethers.providers.getDefaultProvider(RPC);

    const buffer = Buffer.from(MINT_TEXT, "utf8");
    const hexData = buffer.toString("hex");

    let wallets: any = PRIVATE_KEYS.map((privateKey) => {
      try {
        return new ethers.Wallet(privateKey, provider);
      } catch (e) {
        console.log(e);
        return null;
      }
    }).filter((wallet: any) => wallet != null);

    for (let j = 0; j < LOOP; j++) {
      console.log(`Mint lượt thứ ${j + 1}`);

      let gasPrice: any = await provider.getGasPrice();
      gasPrice = Math.ceil(
        Number(gasPrice.toString()) * (GAS_INCREASE > 1 ? GAS_INCREASE : 1)
      ).toString();

      await Promise.all(
        wallets.map((wallet: any) => mint(hexData, wallet, gasPrice))
      );
    }
  } catch (e: any) {
    console.error(e);
  } finally {
    console.log("DONE");
    process.exit(0);
  }
}

main();
