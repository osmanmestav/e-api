import {ethers, utils} from "ethers";
import TronWeb from 'tronweb'
import crypto from 'crypto';


export const walletCreate = async () => {
    //const Url = 'https://data-seed-prebsc-1-s1.binance.org:8545';
    const Url = 'https://bsc-dataseed.binance.org/';
    const provider = new ethers.providers.JsonRpcProvider(Url)

    const mnemonic = ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(16))
    const wallet = await ethers.Wallet.fromMnemonic(mnemonic);
    const walletReturn = await wallet.connect(provider);
    let privateKey = walletReturn.privateKey;
    let publicKey = walletReturn.publicKey;
    let address = await walletReturn.getAddress()
    let _mnemonic = walletReturn._mnemonic()
    let _signingKey = walletReturn._signingKey()
    let balance = await walletReturn.getBalance()
    console.log(privateKey)
    console.log(publicKey)
    console.log(address)
    console.log(_mnemonic)
    console.log(_signingKey)
    console.log(balance.toString())
    return {
        privateKey: privateKey,
        publicKey: publicKey,
        address: address,
        _mnemonic: _mnemonic,
        _signingKey: _signingKey,
        balance: balance
    }
}


export const sendTRC20Token = async (recipientAddress, tokenAmount = 1) => {

    try {
        console.log(111)
        const mainNetProvider = 'https://api.trongrid.io';
        const testNetProvider = 'https://api.shasta.trongrid.io';
        const netProvider = testNetProvider;
        //const HttpProvider = TronWeb.providers.HttpProvider; // Optional provider, can just use a url for the nodes instead
        //const fullNode = new HttpProvider(`${netProvider}`); // Full node http endpoint
        //const solidityNode = new HttpProvider(`${netProvider}`); // Solidity node http endpoint
        const eventServer = `${netProvider}`; // Contract events http endpoint
        const privateKey = 'da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0';
        const tronWeb = new TronWeb(
            //fullNode,
            //solidityNode,
            eventServer,
            privateKey
        );
        const userBalance = await tronWeb.trx.getBalance("TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY");
        console.log(`User's balance is: ${userBalance}`);
        /*const ownerAddress = tronWeb.address.fromPrivateKey(privateKey);
        console.log({ownerAddress});


        const contractAddressHex = tronWeb.address.toHex("TJZxaB8Ra4EEHcrcn3GJHSazcgnXFyt9BE");
        const contractInstance = await tronWeb.contract().at(contractAddressHex);
        const args = {
            callValue: 0,
            shouldPollResponse: true
        };
        const name = await contractInstance.name().call();
        console.log({name});
        const symbol = await contractInstance.symbol().call();
        console.log({symbol});
        const decimals = await contractInstance.decimals().call();
        console.log({decimals});
        const totalSupply = await contractInstance.totalSupply().call();
        console.log({totalSupply: totalSupply.toString(10)});
        const balanceOf = await contractInstance.balanceOf(ownerAddress).call();
        console.log({balanceOf: balanceOf.balance.toString(10)});

        let balanceOfrecipientAddress = await contractInstance.balanceOf(recipientAddress).call();
        console.log({balanceOfrecipientAddress: balanceOfrecipientAddress.balance.toString(10)});

        const amount = tokenAmount * Math.pow(10, decimals);
        //{
        //   block: 1330340,
        //   timestamp: 1579589196000,
        //   contract: 'TARCZ9Bw53DdsZ5eLYwc1GhfEkBAJsoFsv',
        //   name: 'Transfer',
        //   transaction: '8158dda44af6f3f1ae2e65eb5d69787707f4e1ac7a1512b69cae8552e82065be',
        //   result: {
        //     _from: '41cba6374124b2320e7ff309033ecba4be5f81b2ea',
        //     _value: '100000',
        //     _to: '41dc6c365f620cef5fc9949bc008d362c711e9c3fc'
        //   },
        //   resourceNode: 'fullNode',
        //   unconfirmed: true
        // }
        contractInstance['Transfer']().watch((err, event) => {
            if (err) return console.error('Error with "method" event:', err);
            if (event) { // some function
                console.log(event);
            }
        });
        const transfer = await contractInstance.transfer(recipientAddress, amount).send(args);
        console.log({transfer}); // { transfer: { success: true } }

        balanceOfrecipientAddress = await contractInstance.balanceOf(recipientAddress).call();
        console.log({balanceOfrecipientAddress: balanceOfrecipientAddress.balance.toString(10)});

        return transfer.success;*/
    } catch (e) {
        console.log(e.message);
        return null;
    }
}


export const walletCreateTrc20 = async () => {
    var privateKey = crypto.randomBytes(32).toString('hex');
    console.log("Private Key", privateKey);

    const mainNetProvider = 'https://api.trongrid.io';
    const testNetProvider = 'https://api.shasta.trongrid.io';

    const HttpProvider = TronWeb.providers.HttpProvider;
    const fullNode = new HttpProvider(testNetProvider);
    const solidityNode = new HttpProvider(testNetProvider);
    const eventServer = new HttpProvider(testNetProvider);
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);


    const wallet = await tronWeb.createAccount();
    console.log(wallet);
    return wallet;


    /*
    Private Key 07be76b8988a74b6c57b597a38dbcb420fcb6b1cd24995bf77c94dd52c93d1d2
{
  privateKey: '56E711734FE94952002B2059E7C8A2CA3DFB7B887E53997D565BF411AF154926',
  publicKey: '04CD8446B3D874A0EEDADFA7ABA2F9EEBE552497DCF0DA71855049E59D13D3663A4F152944EA467B1728D4C0B213C7FC27367CB13DF2AD326CA462A7B133BA328E',
  address: {
    base58: 'TJZxaB8Ra4EEHcrcn3GJHSazcgnXFyt9BE',
    hex: '415E53852B05E8AE29BF5407C7752DA861DE130451'
  }
}


     */
}


async function getBalance(network, address, CONTRACT) {
    const trc20ContractAddress = CONTRACT;
    let url = "https://api.shasta.trongrid.io";
    let headers = {};
    headers["TRON-PRO-API-KEY"] = "769fa9c0-f3e1-4ee9-8a90-9f5e81ec070c";
    const tronWeb = new TronWeb({
        fullHost: url,
        headers: headers,
        privateKey: "da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0",
    });
    const contractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // USDT TRC-20 akıllı sözleşme adresi
    const toAddress = 'TELpuG4gt8pecM33rdh5TemFUVwEqw6TqE'; // Transferin yapılacağı cüzdan adresi
    const amount = 100; // Transfer miktarı (USDT'yi kaç haneli girdiyseniz o şekilde girin)

    const account = await tronWeb.trx.getAccount();
    console.log(account)
    const contract = tronWeb.contract().at(contractAddress).then(() => {
        console.log("ok");
    })
        .catch((err) => {
            console.log("error:", err);
        });
    /*
        const decimals = await contract.decimals().call();
        const transferAmount = amount * 10 ** decimals;

        const transferOptions = {
            feeLimit: 1_000_000, // TRX cinsinden işlem ücreti limiti
            callValue: 0,
        };

        const transaction = await contract.transfer(toAddress, transferAmount).send(transferOptions, "da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0");
        console.log(transaction)*/

    /*
    var a = await tronWeb.address.fromPrivateKey("da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0");
    //console.log(a)
    var b = await tronWeb.trx.getBalance("TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY");
    console.log("====>", b)
    //const userBalance = await tronWeb.trx.getBalance(address);
    //console.log(userBalance)

    let contact = "TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY";
    const trn = await tronWeb.trx.getContract(contact);
    const contract = tronWeb.contract(trn.abi.entrys, contact);
    const balance = await contract.methods.balanceOf("TELpuG4gt8pecM33rdh5TemFUVwEqw6TqE").call();
    console.log("balance:", balance.toString());

    const resp = await contract.methods.transfer(ACCOUNT, 1000).send();
    console.log("transfer:", resp);*/


}

//getBalance("shasta", "TJZxaB8Ra4EEHcrcn3GJHSazcgnXFyt9BE", "TJZxaB8Ra4EEHcrcn3GJHSazcgnXFyt9BE", "56E711734FE94952002B2059E7C8A2CA3DFB7B887E53997D565BF411AF154926", "769fa9c0-f3e1-4ee9-8a90-9f5e81ec070c");


const url = "https://api.shasta.trongrid.io";
const headers = {
    "TRON-PRO-API-KEY": "769fa9c0-f3e1-4ee9-8a90-9f5e81ec070c"
};

const tronWeb = new TronWeb({
    fullHost: url,
    //headers: headers,
    privateKey: "da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0"
});

const contractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
const toAddress = 'TELpuG4gt8pecM33rdh5TemFUVwEqw6TqE';
const amount = 100;

async function transferUSDT() {
    try {
        const account = await tronWeb.trx.getAccount();
        console.log(account);

        let connect = await tronWeb.fullNode.isConnected()
        console.log(connect)

        const contract = await tronWeb.contract().at(contractAddress);
        console.log('Contract successfully loaded.');

        const decimals = await contract.decimals().call();
        const transferAmount = amount * 10 ** decimals;

        const transferOptions = {
            feeLimit: 1_000_000,
            callValue: 0,
        };

        const transaction = await contract.transfer(toAddress, transferAmount).send(transferOptions);

        console.log('Transfer successful. Transaction ID:', transaction);
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

transferUSDT();


/*
Private Key 42981185949f12ad44d2e31cf2db6a5bd587f3dd91cd5325b905d0b01f512b1f
{
  privateKey: '7B8BA4D69A1F7F0D7F403D6CB04A42A8EE9351A1FD39426EB684A402BD216606',
  publicKey: '042215BD0C03DEE498E0671C38965B3B4C1474253E0AD78B7B7AC54E08285EF413CCAEC7B82E09764BD45857D0F5028A6F50918EEFA1601C858A880F2DC6F41049',
  address: {
    base58: 'TELpuG4gt8pecM33rdh5TemFUVwEqw6TqE',
    hex: '412FF734C744BFFD8F6AF5989B1A35702127ED58AC'
  }
}

 */