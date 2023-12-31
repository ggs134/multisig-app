const ethers = require("ethers")
const multisig_abi = require('./multisig.json')["abi"];
// const token_abi = require('./testToken.json')["abi"];
const env_args = require('./env.js');

const titan_ton_abi = require('./titanTON.json');
const titan_USD_abi = require('./titanTON.json');

//environment variables
const TON_ADDRESS = env_args["TON_ADDRESS"];
const USDT_ADDRESS = env_args["USDT_ADDRESS"];
const USDC_ADDRESS = env_args["USDC_ADDRESS"];

const MULTISIG_ADDRESS = env_args["MULTISIG_ADDRESS"];

const NETWOROK_URL = env_args["NETWOROK_URL"];
const NETWORK_ID = env_args["NETWORK_ID"];

document.addEventListener(
  'DOMContentLoaded', 
  check_connection_change_interface(), 
  false
);

async function check_network(){
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  let network = await provider.getNetwork();
  let chainId = await network.chainId;
  if(await chainId != NETWORK_ID){
    return false;
  } else {
    return true;
  }
}

async function address_shortner(_address){
  let last4 = _address.slice(-4);
  let first5 = _address.slice(0,5);
  return first5 + "..." + last4;
}

async function isConnected() {
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  // console.log(`Chain ID : ${provider.network.chainId}`);
  let accounts = await provider.listAccounts();
  if (accounts.length) {
    return true;
  } else {
    return false;
  }
}

export async function check_connection_change_interface(){
  
  //check connection and change interface
  
  //1.connected 
  //1.1 logged in status : change address
  //1.2 logged out status : change interface
  
  //2.disconnected
  //2.1 logged in status : change interface
  //2.2 logged out status : do nothing

  // console.log("on load function started");
  // console.log("is connected? ", await isConnected() == true);

  //TODO : check network
  // if(provider.network.chainId != NETWORK_ID){
  //   alert("Change your network");
  // }

  //get login section and login button

  //**** */ const account = document.getElementById("account");
  
  const btn_div = document.getElementById("btn-login");

  //checking metamask unlocked
  let is_connected = await isConnected();
  if(is_connected){

    //check network when connected
    if(await check_network() != true){
      alert("check your network");
      return;
    }

    const account = document.getElementById("account");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addrs = await signer.getAddress();

    //Create <div id="addresss">0xabc...</div>
    const addrs_div = document.createElement('div');
    addrs_div.setAttribute("id", "address");
    addrs_div.innerHTML = addrs;

    //create logout wrapper
    // <div id="btn-logout">
    //    <button onclick="kevin.logout()">Logout</button>
    // </div>
    const logout_wrapper = document.createElement('div');
    logout_wrapper.setAttribute("id", "btn-logout")

    //Create logout button
    let btn_logout = document.createElement("button");
    btn_logout.innerHTML = "Logout";
    btn_logout.setAttribute("onclick","kevin.logout()");

    //wrap address and logout button by logout_div
    logout_wrapper.appendChild(addrs_div);
    logout_wrapper.appendChild(btn_logout);

    let login_wrapper_before = document.getElementById("btn-login");
    let logout_wrapper_before = document.getElementById("btn-logout");
    
    if(login_wrapper_before){
      console.log("connected, logged out");
      console.log(login_wrapper_before); //something
      console.log(logout_wrapper_before); // null
      //showing login button
      //change something because already connected, no need login button
      //change wrapper to logout button
      console.log(account);
      account.innerHTML = "";
      account.appendChild(logout_wrapper);
    };

    if(logout_wrapper_before){
      // console.log("connected, already logged in");
      // console.log(logout_wrapper_before);
      //showing logout button
      //change showing address
      let address_div = document.getElementById("address");
      
      //change to current address
      address_div.innerHTML = addrs;
    };

  }else{
    const account = document.getElementById("account");
    //disconnected status
    //show login button
    
    //create login button
    let login_button = document.createElement('button');
    login_button.setAttribute("onclick", "kevin.login()");
    login_button.innerHTML = "Connect Wallet";

    //create login button wrapper
    let login_btn_div = document.createElement('div');
    login_btn_div.setAttribute("id", "btn-login")

    //wrap button
    login_btn_div.appendChild(login_button);

    //if already display login, change
    //if already display logout, stay same

    //replace child div
    let btn_logout_before = document.getElementById('btn-logout');
    let btn_login_before = document.getElementById('btn-login');

    // console.log("btn_logout_before, btn_login_before");
    // console.log(btn_logout_before);
    // console.log(btn_login_before);

    if(btn_logout_before){
      //disconnected, but logged in
      //change interface
      // console.log("disconnected, but logout display(logged in)");
      account.innerHTML = "";
      account.appendChild(login_btn_div);
      return;
    }
    
    if(btn_login_before){
      //disconnected and logged out
      //do nothing
      // console.log("disconnected, but logout display(logged out)");
    }
    
  }
}

function address_to_token(_address){
  if(_address == TON_ADDRESS){
    return "TON";
  } 
  else if (_address == USDT_ADDRESS){
    return "USDT";
  }
  else if (_address == USDC_ADDRESS){
    return "USDC";
  }
}

function token_to_address(_token){
  if(_token == "TON"){
    return TON_ADDRESS;
  } 
  else if (_token == "USDT"){
    return USDT_ADDRESS;
  }
  else if (_token == "USDC"){
    return USDC_ADDRESS;
  }
}

export async function login() {
  
  //check network
  if(await check_network() != true){
    alert("check your network");
    return;
  }

  //Ethereum mainnet provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  
  //local test network
  // const url = 'http://127.0.0.1:8545/';//hardhat node
  // const customProvider = new ethers.providers.JsonRpcProvider(url);
  
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const addrs = await signer.getAddress();

  //get login section and login button
  const account = document.getElementById("account");
  const btn_div = document.getElementById("btn-login");

  //Create <div id="addresss">0xabc...</div>
  const addrs_div = document.createElement('div');
  addrs_div.setAttribute("id", "address");
  addrs_div.innerHTML = addrs;

  //Create
  // <div id="btn-logout">
  //    <button onclick="kevin.logout()">Logout</button>
  // </div>
  const logout_btn_div = document.createElement('div');
  logout_btn_div.setAttribute("id", "btn-logout")
  //Create button
  let btn_logout = document.createElement("button");
  btn_logout.innerHTML = "Logout";
  btn_logout.setAttribute("onclick","kevin.logout()");
  logout_btn_div.appendChild(btn_logout);

  //replace button to address, and append logout button
  account.replaceChild(addrs_div, btn_div);
  account.appendChild(logout_btn_div);

  // console.log(addrs);
}

export async function logout() {
  //get login section and login button
  const account = document.getElementById("account");
  const btn_div = document.getElementById("btn-logout");
  const address = document.getElementById("address");

  //Create
  // <div id="btn-login">
  //    <button onclick="kevin.logout()">Login</button>
  // </div>
  const login_btn_div = document.createElement('div');
  login_btn_div.setAttribute("id", "btn-login")
  //Create button
  let btn_login = document.createElement("button");
  btn_login.innerHTML = "Login";
  btn_login.setAttribute("onclick","kevin.login()");
  login_btn_div.appendChild(btn_login);

  //remove address
  //replace logout to login button
  account.innerHTML = "";
  account.appendChild(login_btn_div);

  //lock metatask
  alert("Lock your metamask or it stays logged in");
}

async function delete_all_balances(){
  const balance_ul = document.getElementById("token-balances");
  balance_ul.innerHTML = "";
}

export async function set_all_balance(){

  delete_all_balances();

  const balance_ul = document.getElementById("token-balances");

  // const ton_div = document.getElementById("ton-balance");
  // const usdt_div = document.getElementById("usdt-balance");
  // const usdc_div = document.getElementById("usdc-balance");

  let buttons = document.getElementsByTagName("button");


  //Loading hook in
  let original_texts = [];
  for(let k=0; k<buttons.length; k++){
    original_texts.push(buttons[k].innerHTML);
    buttons[k].innerHTML = "Loading..";
    buttons[k].setAttribute("disabled","");
  }

  let ton_bal = await get_TON_balance();
  let usdt_bal = await get_USDT_balance();
  let usdc_bal = await get_USDC_balance();
  // console.log(ton_bal);

  //Loading hook out
  for(let k=0; k<buttons.length; k++){
    buttons[k].innerHTML = original_texts[k];
    buttons[k].removeAttribute("disabled");
  }

  let ton_li = document.createElement('li');
  let usdt_li = document.createElement('li');
  let usdc_li = document.createElement('li');

  let ton_bal_fixed = Number(ton_bal).toFixed(1);
  let usdt_bal_fixed = Number(usdt_bal).toFixed(1);
  let usdc_bal_fixed = Number(usdc_bal).toFixed(1);

  let ton_bal_comma = ethers.utils.commify(ton_bal_fixed);
  let usdt_bal_comma = ethers.utils.commify(usdt_bal_fixed);
  let usdc_bal_comma = ethers.utils.commify(usdc_bal_fixed);
  // console.log(ethers.utils.commify(ton_bal_fixed));
  // console.log(ethers.utils.commify(Number(ton_bal)));

  ton_li.innerHTML = "TON : " + ton_bal_comma;
  usdt_li.innerHTML = "USDT : " + usdt_bal_comma;
  usdc_li.innerHTML = "USDC : " + usdc_bal_comma;

  balance_ul.appendChild(ton_li);
  balance_ul.appendChild(usdt_li);
  balance_ul.appendChild(usdc_li);
}

export async function get_TON_balance(){
  // let bal = await get_balance_of_multisig("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512")
  let bal = await get_balance_target(TON_ADDRESS, MULTISIG_ADDRESS);
  return bal;
}

export async function get_USDT_balance(){
  // let bal = await get_balance_of_multisig("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512")
  let bal = await get_balance_target(USDT_ADDRESS, MULTISIG_ADDRESS);
  return bal;
}

export async function get_USDC_balance(){
  // let bal = await get_balance_of_multisig("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512")
  let bal = await get_balance_target(USDC_ADDRESS, MULTISIG_ADDRESS);
  return bal;
}

export async function get_balance_target(_token, _target) {
  const customProvider = new ethers.providers.JsonRpcProvider(NETWOROK_URL);
  if(_token == TON_ADDRESS){
    const ton = new ethers.Contract(_token, titan_ton_abi, customProvider);
    let _balance = await ton.balanceOf(_target);
    return ethers.utils.formatEther(_balance);
  } else {
    const usd = new ethers.Contract(_token, titan_USD_abi, customProvider);
    let _balance = await usd.balanceOf(_target);
    return ethers.utils.formatUnits(_balance, 6);
  } 
}

export async function get_num_submitted_txs() {
  // console.log("get_num_submitted_txs() in");
  const customProvider = new ethers.providers.JsonRpcProvider(NETWOROK_URL);
  const multisig = new ethers.Contract(MULTISIG_ADDRESS, multisig_abi, customProvider);
  // console.log(multisig);

  const count = await multisig.getTransactionCount();
  
  // console.log(count);

  return count.toNumber();
}

export async function get_list_submitted_txs() {
  const customProvider = new ethers.providers.JsonRpcProvider(NETWOROK_URL);
  const multisig = new ethers.Contract(MULTISIG_ADDRESS, multisig_abi, customProvider);
  let length = await get_num_submitted_txs();

  let res = {};

  for (let i = 0; i < length; i++) {
    res[i] = await multisig.getTransaction(i);
  }
  // const txs = await multisig.getTransaction(0);
  // console.log(txs);
  //{0 : {to : ## , value : ##, data : ##, executed : ##, numConfirmations: ##}, ... }
  return res;
}

async function tx_confirmed_by_whom(_index, _address){
  const customProvider = new ethers.providers.JsonRpcProvider(NETWOROK_URL);
  const multisig = new ethers.Contract(MULTISIG_ADDRESS, multisig_abi, customProvider);
  // console.log(multisig.isConfirmed(_index, _address));
  let isConfirmed = multisig.isConfirmed(_index, _address);
  return isConfirmed;
}

async function get_num_confirmations(){
  const customProvider = new ethers.providers.JsonRpcProvider(NETWOROK_URL);
  const multisig = new ethers.Contract(MULTISIG_ADDRESS, multisig_abi, customProvider);
  return multisig.numConfirmationsRequired.call();
}

async function get_multisig_owners(){
  const customProvider = new ethers.providers.JsonRpcProvider(NETWOROK_URL);
  const multisig = new ethers.Contract(MULTISIG_ADDRESS, multisig_abi, customProvider);
  return multisig.getOwners();
}

async function get_transaction_count(){
  const customProvider = new ethers.providers.JsonRpcProvider(NETWOROK_URL);
  const multisig = new ethers.Contract(MULTISIG_ADDRESS, multisig_abi, customProvider);
  let big_num_count = await multisig.getTransactionCount();
  return await big_num_count.toNumber();
}

async function who_confirm_tx(_index){
  let owners = await get_multisig_owners();
  let owners_confirmed = [];
  // console.log(owners);
  for(let i = 0; i < owners.length; i++){
    let owner = owners[i];
    // console.log(owner);
    if(await tx_confirmed_by_whom(_index, owner)){
      owners_confirmed.push(owner);
    }
  }

  return owners_confirmed;
}

// async function decode_submitted_data(_txData) {
//   const customProvider = new ethers.providers.JsonRpcProvider(NETWOROK_URL);
//   const token = new ethers.Contract(TON_ADDRESS, titan_ton_abi, customProvider);
//   let decoded = await token.interface.decodeFunctionData("transfer", _txData)
//   //[recipient, amount(wei)]
//   return decoded;
// }

async function decode_transfer_ton_data(_txData) {
  const customProvider = new ethers.providers.JsonRpcProvider(NETWOROK_URL);
  const token = new ethers.Contract(TON_ADDRESS, titan_ton_abi, customProvider);
  let decoded = await token.interface.decodeFunctionData("transfer", _txData)
  //[recipient, amount(wei)]
  return decoded;
}

async function decode_transfer_usd_data(_txData) {
  const customProvider = new ethers.providers.JsonRpcProvider(NETWOROK_URL);
  const token = new ethers.Contract(USDT_ADDRESS, titan_USD_abi, customProvider);
  let decoded = await token.interface.decodeFunctionData("transfer", _txData)
  //[recipient, amount(wei)]
  return decoded;
}

async function clear_submitted_txs(){
  //row
  let row = document.createElement('tr');

  //each data section
  let index_th = document.createElement('th');
  let recipient_th = document.createElement('th');
  let currency_th = document.createElement('th');
  let amount_th = document.createElement('th');
  let confirmations_th = document.createElement('th');
  let confirm_by_th = document.createElement('th');
  let executed_th = document.createElement('th');

  index_th.innerHTML = "Index";
  recipient_th.innerHTML = "Recipient";
  currency_th.innerHTML = "Currency";
  amount_th.innerHTML = "Amount";
  confirmations_th.innerHTML = "#Approvals";
  confirm_by_th.innerHTML = "Approved by";
  executed_th.innerHTML = "Executed";

  //build row
  row.appendChild(index_th);
  row.appendChild(recipient_th);
  row.appendChild(currency_th);
  row.appendChild(amount_th);
  row.appendChild(confirmations_th);
  row.appendChild(confirm_by_th);
  row.appendChild(executed_th);

  //clear table
  let table = document.getElementById("submitted-txs");
  table.innerHTML = "";

  //set index
  table.appendChild(row);
}

export async function load_submitted_txs(){
  await clear_submitted_txs();
  
  //Loading hook in
  let buttons = document.getElementsByTagName("button");
  let original_texts = [];
  for(let k=0; k<buttons.length; k++){
    original_texts.push(buttons[k].innerHTML);
    buttons[k].innerHTML = "Loading..";
    buttons[k].setAttribute("disabled","");
  }

  let txs = await get_list_submitted_txs();

  //table section
  let table = document.getElementById("submitted-txs");

  //row loop
  // console.log(txs);

  // It is increase
  // for(let i = 0; i < Object.keys(txs).length; i++){

  // it is decrease
  for(let i = Object.keys(txs).length-1; i > -1; i--){

    //row
    let row = document.createElement('tr');
    
    //each data section
    let index_td = document.createElement('td');
    let recipient_td = document.createElement('td');
    let currency_td = document.createElement('td');
    let amount_td = document.createElement('td');
    let confirmations_td = document.createElement('td');
    let confirm_by_td = document.createElement('td');
    let executed_td = document.createElement('td');

    //get each row data

    let currency = await address_to_token(txs[i].to);
    let decoded;
    let amount;

    // console.log(currency);

    if(currency == "TON"){
      decoded = await decode_transfer_ton_data(txs[i].data);
      // console.log(decoded, "TON");
      amount = ethers.utils.formatEther(decoded.amount);
    }else{
      decoded = await decode_transfer_usd_data(txs[i].data);
      amount = ethers.utils.formatUnits(decoded.amount, 6);
    }
    
    // console.log(decoded, "if out");
    // console.log(decoded.to, "decoded.to");
    // console.log(decoded.recipient, "decoded.to");

    let index = i
    let recipient = decoded.recipient;
    let recipient_trimed = await address_shortner(recipient);
    // let amount = ethers.utils.formatEther(decoded.amount);
    let confirmations = txs[i].numConfirmations.toNumber();

    let confirm_by = await who_confirm_tx(i);
    let confirm_by_trimed = [];
    for(let j=0; j<confirm_by.length; j++){
      let confirmer = confirm_by[j];
      // confirm_by_trimed.push(confirmer.slice(0, -35)+"..");
      confirm_by_trimed.push(await address_shortner(confirmer));
    }

    let executed = txs[i].executed;

    // console.log(decoded);
    // console.log(index);
    // console.log(recipient);
    // console.log(recipient_trimed);
    // console.log(amount);
    // console.log(currency);
    // console.log(confirmations);
    // console.log(executed);
    
    //set each row data
    index_td.innerHTML = index;
    recipient_td.innerHTML = recipient_trimed;
    currency_td.innerHTML = currency;
    amount_td.innerHTML = amount;
    confirmations_td.innerHTML = confirmations;
    confirm_by_td.innerHTML = confirm_by_trimed;
    executed_td.innerHTML = executed;

    //build row
    row.appendChild(index_td);
    row.appendChild(recipient_td);
    row.appendChild(currency_td);
    row.appendChild(amount_td);
    row.appendChild(confirmations_td);
    row.appendChild(confirm_by_td);
    row.appendChild(executed_td);

    //append table
    table.appendChild(row);
  }
  //Loading hook out
  for(let k=0; k<buttons.length; k++){
    buttons[k].innerHTML = original_texts[k];
    buttons[k].removeAttribute("disabled");
  }

}

export async function submit_transaction(_to, _amount, _token){
    //Ethereum mainnet provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
  
    //local test network
    // const url = 'http://127.0.0.1:8545/';//hardhat node
    // const customProvider = new ethers.providers.JsonRpcProvider(url);
    
    await provider.send("eth_requestAccounts", []);
    
    //signer : current connected account
    const signer = await provider.getSigner();
    const addrs = await signer.getAddress();

    const customProvider = new ethers.providers.JsonRpcProvider(NETWOROK_URL);
    const multisig = new ethers.Contract(MULTISIG_ADDRESS, multisig_abi, customProvider);
    let token;
    if(_token == TON_ADDRESS){
      token = new ethers.Contract(_token, titan_ton_abi, customProvider);
    } else {
      token = new ethers.Contract(_token, titan_USD_abi, customProvider);
    }
    // const token = new ethers.Contract(_token, token_abi, customProvider);

    const tx_data = await token.interface.encodeFunctionData("transfer",[_to, _amount]);

    const submit_tx = await multisig.connect(signer).submitTransaction(
      _token,
      0,
      tx_data
    )
    return submit_tx;
}

export async function confirm_transaction(_index) {
  //Ethereum mainnet provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  
  //signer : current connected account
  const signer = await provider.getSigner();
  const addrs = await signer.getAddress();

  const customProvider = new ethers.providers.JsonRpcProvider(NETWOROK_URL);
  const multisig = new ethers.Contract(MULTISIG_ADDRESS, multisig_abi, customProvider);

  let confirm_message=`
  ${_index} is approved by you. 
  Are you sure?
  `;
  
  let is_confirmed = confirm(confirm_message);
  if(is_confirmed == false){
    return
  }
  
  const confirm_tx = await multisig.connect(signer).confirmTransaction(_index);

  //clear pending list
  clear_pending_txs();
  //reload pending list
  load_pending_txs()

  return confirm_tx;
}

export async function revoke_confirmation(_index) {
  //Ethereum mainnet provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  
  //signer : current connected account
  const signer = await provider.getSigner();
  const addrs = await signer.getAddress();

  const customProvider = new ethers.providers.JsonRpcProvider(NETWOROK_URL);
  const multisig = new ethers.Contract(MULTISIG_ADDRESS, multisig_abi, customProvider);
  
  let confirm_message=`
  ${_index} is revoked, are you sure?
  `;
  
  let is_confirmed = confirm(confirm_message);
  if(is_confirmed == false){
    return
  }

  const revoke_tx = await multisig.connect(signer).revokeConfirmation(_index);

  //clear pending list
  clear_pending_txs();
  //reload pending list
  load_pending_txs()

  return revoke_tx;
}

export async function execute_transaction(_index) {
  //Ethereum mainnet provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  
  //signer : current connected account
  const signer = await provider.getSigner();
  const addrs = await signer.getAddress();

  const customProvider = new ethers.providers.JsonRpcProvider(NETWOROK_URL);
  const multisig = new ethers.Contract(MULTISIG_ADDRESS, multisig_abi, customProvider);
  
  //confirm with token to, amount
  // get submitted data
  // decode submitted tx
  // build message
  // make confirm if statement

  let tx_obj = await multisig.getTransaction(_index);
  // console.log(tx_obj);
  // console.log(tx_obj.data); // to whome, amount
  // console.log(tx_obj.to) // token type

  let token_type = address_to_token(tx_obj.to);
  // console.log(token_type);

  let tx_decoded;
  let token_amount;

  if(token_type == "TON"){
    tx_decoded = await decode_transfer_ton_data(tx_obj.data);
    token_amount = ethers.utils.formatEther(tx_decoded.amount);
  }else{
    tx_decoded = await decode_transfer_usd_data(tx_obj.data);
    token_amount = ethers.utils.formatUnits(tx_decoded.amount, 6);
  }

  // let tx_decoded = await decode_submitted_data(tx_obj.data);
  // // console.log(tx_decoded);

  // let token_amount = ethers.utils.formatEther(tx_decoded.amount);
  // console.log(token_amount);

  let token_recipient = tx_decoded.recipient;
  // console.log(token_recipient);

  let confirm_message = `Are you sure to Execute Tx?
  1.Index     : ${_index}
  2.Token     : ${token_type}
  3.Amount    : ${token_amount}
  4.Recipient : ${token_recipient}
  `;

  let is_execute_confirm = confirm(confirm_message);

  if(is_execute_confirm == false){
    return
  }

  const execute_tx = await multisig.connect(signer).executeTransaction(_index);
  return execute_tx;
}


export async function change_owner(_slot, _newOwner) {
  //Ethereum mainnet provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  
  //signer : current connected account
  const signer = await provider.getSigner();
  const addrs = await signer.getAddress();

  const customProvider = new ethers.providers.JsonRpcProvider(NETWOROK_URL);
  const multisig = new ethers.Contract(MULTISIG_ADDRESS, multisig_abi, customProvider);
  
  if(await multisig.isMaster(addrs) != true){
    alert("You are not a Master");
    return;
  }

  const change_owner_tx = await multisig.connect(signer).changeOwner(_slot, _newOwner);
  return change_owner_tx;
}

export async function change_master(_newMaster) {
  //Ethereum mainnet provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  
  //signer : current connected account
  const signer = await provider.getSigner();
  const addrs = await signer.getAddress();

  const customProvider = new ethers.providers.JsonRpcProvider(NETWOROK_URL);
  const multisig = new ethers.Contract(MULTISIG_ADDRESS, multisig_abi, customProvider);
  
  if(await multisig.isMaster(addrs) != true){
    alert("You are not a Master");
    return;
  }

  const change_master_tx = await multisig.connect(signer).changeMaster(_newMaster);
  return change_master_tx;
}

export async function change_confirmations(_newConfirms) {
  //Ethereum mainnet provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  
  //signer : current connected account
  const signer = await provider.getSigner();
  const addrs = await signer.getAddress();

  const customProvider = new ethers.providers.JsonRpcProvider(NETWOROK_URL);
  const multisig = new ethers.Contract(MULTISIG_ADDRESS, multisig_abi, customProvider);
  
  if(await multisig.isMaster(addrs) != true){
    alert("You are not a Master");
    return;
  }

  const change_confirms_tx = await multisig.connect(signer).changeNumConfirmationsRequired(_newConfirms);
  return change_confirms_tx;
}

// export async function test(){
//   const to = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
//   const amount = ethers.utils.parseEther("0.11");
//   const token = TON_ADDRESS;

//   submit_transaction(to, amount, token);
// }

async function clear_pending_txs(){
  //table section
  let table = document.getElementById("pending-txs");
  table.innerHTML = "";
  let row = document.createElement('tr');

  //each data section
  let index_th = document.createElement('th');
  let recipient_th = document.createElement('th');
  let currency_th = document.createElement('th');
  let amount_th = document.createElement('th');
  let confirmations_th = document.createElement('th');
  let confirm_by_th = document.createElement('th');
  let executed_th = document.createElement('th');
  let action_th = document.createElement('th');

  index_th.innerHTML = "Index";
  recipient_th.innerHTML = "Recipient";
  currency_th.innerHTML = "Currency";
  amount_th.innerHTML = "Amount";
  confirmations_th.innerHTML = "#Approvals";
  confirm_by_th.innerHTML = "Approved by";
  executed_th.innerHTML = "Executed";
  action_th.innerHTML = "Action";

  //build row
  row.appendChild(index_th);
  row.appendChild(recipient_th);
  row.appendChild(currency_th);
  row.appendChild(amount_th);
  row.appendChild(confirmations_th);
  row.appendChild(confirm_by_th);
  row.appendChild(executed_th);
  row.appendChild(action_th);

  //append table
  table.appendChild(row);
}

export async function load_pending_txs() {

  //Loading hook in
  let load_btn = document.getElementById("btn-load-approve");
  let btn_origin_text = load_btn.innerHTML;
  load_btn.innerHTML = "Loading..";
  load_btn.setAttribute("disabled","");

  let execute_load_btn = document.getElementById("btn-load-execute");
  execute_load_btn.innerHTML = "Loading..";
  execute_load_btn.setAttribute("disabled","");

  clear_pending_txs();

  //Ethereum mainnet provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  
  //signer : current connected account
  const signer = await provider.getSigner();
  const addrs_me = await signer.getAddress();

  let txs = await get_list_submitted_txs();

  //table section
  let table = document.getElementById("pending-txs");

  //row loop
  // console.log(txs);

  //increased order
  // for(let i = 0; i < Object.keys(txs).length; i++){

  //decreased order
  for(let i = Object.keys(txs).length-1; i > -1; i--){
    //row
    let row = document.createElement('tr');

    //continue if it is executed
    let executed = txs[i].executed;
    let confirmations = txs[i].numConfirmations.toNumber();
    if(executed == true){continue;}
    
    //each data section
    let index_td = document.createElement('td');
    let recipient_td = document.createElement('td');
    let currency_td = document.createElement('td');
    let amount_td = document.createElement('td');
    let confirmations_td = document.createElement('td');
    let confirm_by_td = document.createElement('td');
    let executed_td = document.createElement('td');
    let action_td = document.createElement('td');

    //get each row data

    let currency = address_to_token(txs[i].to);
    let decoded;
    let amount;
    if(currency == "TON"){
      decoded = await decode_transfer_ton_data(txs[i].data);
      amount = ethers.utils.formatEther(decoded.amount);
    }else{
      decoded = await decode_transfer_usd_data(txs[i].data);
      amount = ethers.utils.formatUnits(decoded.amount, 6);
    }

    // let decoded = await decode_submitted_data(txs[i].data);

    let index = i
    let recipient = decoded.recipient;
    // let recipient_trimed = recipient.slice(0, -35)+"..."
    let recipient_trimed = await address_shortner(recipient);
    // let amount = ethers.utils.formatEther(decoded.amount);
    

    let confirm_by = await who_confirm_tx(i);
    let confirm_by_trimed = [];
    for(let j=0; j<confirm_by.length; j++){
      let confirmer = confirm_by[j];
      confirm_by_trimed.push(await address_shortner(confirmer));
    }

    //if confirmed by me, unapprove
    //if not confirmed by me, approve
    //if confirmations == 0, canceled and disabled

    let action_button = document.createElement('button');

    let is_me_included = confirm_by.includes(addrs_me);

    if(is_me_included){
      action_button.innerHTML = "unapprove";
      let onclick_func = "kevin.revoke_confirmation("+i+")";
      action_button.setAttribute("onclick",onclick_func);
    }else{
      action_button.innerHTML = "approve";
      let onclick_func = "kevin.confirm_transaction("+i+")";
      action_button.setAttribute("onclick",onclick_func);
    }

    if(confirmations == 0){
      action_button.innerHTML = "canceled";
      action_button.setAttribute("disabled","");
    }

    if(confirmations == 1 && is_me_included){
      action_button.innerHTML = "cancel";
    }


    action_button.setAttribute("id", index);
    
    //set each row data
    index_td.innerHTML = index;
    recipient_td.innerHTML = recipient_trimed;
    currency_td.innerHTML = currency;
    amount_td.innerHTML = amount;
    confirmations_td.innerHTML = confirmations;
    confirm_by_td.innerHTML = confirm_by_trimed;
    executed_td.innerHTML = executed;
    action_td.appendChild(action_button);

    //build row
    row.appendChild(index_td);
    row.appendChild(recipient_td);
    row.appendChild(currency_td);
    row.appendChild(amount_td);
    row.appendChild(confirmations_td);
    row.appendChild(confirm_by_td);
    row.appendChild(executed_td);
    row.appendChild(action_td);

    //append table
    table.appendChild(row);
  }
  //Loading hook out
  load_btn.innerHTML = btn_origin_text;
  execute_load_btn.innerHTML = btn_origin_text;

  load_btn.removeAttribute("disabled");
  execute_load_btn.removeAttribute("disabled");
}

async function clear_execute_txs(){
  //table section
  let table = document.getElementById("execute-txs");
  table.innerHTML = "";
  let row = document.createElement('tr');

  //each data section
  let index_th = document.createElement('th');
  let recipient_th = document.createElement('th');
  let currency_th = document.createElement('th');
  let amount_th = document.createElement('th');
  let confirmations_th = document.createElement('th');
  let confirm_by_th = document.createElement('th');
  let executed_th = document.createElement('th');
  let action_th = document.createElement('th');

  index_th.innerHTML = "Index";
  recipient_th.innerHTML = "Recipient";
  currency_th.innerHTML = "Currency";
  amount_th.innerHTML = "Amount";
  confirmations_th.innerHTML = "#Approvals";
  confirm_by_th.innerHTML = "Approved by";
  executed_th.innerHTML = "Executed";
  action_th.innerHTML = "Action";

  //build row
  row.appendChild(index_th);
  row.appendChild(recipient_th);
  row.appendChild(currency_th);
  row.appendChild(amount_th);
  row.appendChild(confirmations_th);
  row.appendChild(confirm_by_th);
  row.appendChild(executed_th);
  row.appendChild(action_th);

  //append table
  table.appendChild(row);
}

export async function load_execute_txs() {

  //Loading hook in
  let load_btn = document.getElementById("btn-load-approve");
  let btn_origin_text = load_btn.innerHTML;
  load_btn.innerHTML = "Loading..";
  load_btn.setAttribute("disabled","");

  let execute_load_btn = document.getElementById("btn-load-execute");
  execute_load_btn.innerHTML = "Loading..";
  execute_load_btn.setAttribute("disabled",""); 

  clear_execute_txs();

  //Ethereum mainnet provider
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  
  //signer : current connected account
  const signer = await provider.getSigner();
  const addrs_me = await signer.getAddress();

  let txs = await get_list_submitted_txs();
  let num_confirmations = await get_num_confirmations();
  let num_conf_thread = num_confirmations - 1

  //table section
  let table = document.getElementById("execute-txs");

  //row loop
  // console.log(txs);

  // increase order
  // for(let i = 0; i < Object.keys(txs).length; i++){

  // decrease order
  for(let i = Object.keys(txs).length-1; i > -1; i--){

    //row
    let row = document.createElement('tr');

    //continue if it is executed or confirm is 0
    let executed = txs[i].executed;
    let confirmations = txs[i].numConfirmations.toNumber();

    //if confirmations == numRequiredConfirmations-1, then continue
    if(confirmations <= num_conf_thread ){continue;}
    
    //each data section
    let index_td = document.createElement('td');
    let recipient_td = document.createElement('td');
    let currency_td = document.createElement('td');
    let amount_td = document.createElement('td');
    let confirmations_td = document.createElement('td');
    let confirm_by_td = document.createElement('td');
    let executed_td = document.createElement('td');
    let action_td = document.createElement('td');

    //get each row data
    let currency = address_to_token(txs[i].to);
    let decoded;
    let amount;
    if(currency == "TON"){
      decoded = await decode_transfer_ton_data(txs[i].data);
      amount = ethers.utils.formatEther(decoded.amount);
    }else{
      decoded = await decode_transfer_usd_data(txs[i].data);
      amount = ethers.utils.formatUnits(decoded.amount, 6);
    }


    // let decoded = await decode_submitted_data(txs[i].data);

    let index = i;
    let recipient = decoded.recipient;
    // let recipient_trimed = recipient.slice(0, -35)+"...";
    let recipient_trimed = await address_shortner(recipient);
    // let amount = ethers.utils.formatEther(decoded.amount);
    

    let confirm_by = await who_confirm_tx(i);
    let confirm_by_trimed = [];
    for(let j=0; j<confirm_by.length; j++){
      let confirmer = confirm_by[j];
      confirm_by_trimed.push(await address_shortner(confirmer));
    }

    
    //if executed then no button
    //it not executed then execute button

    let action_button = document.createElement('button');
    for(let j=0; j<confirm_by.length; j++){
      if(executed == true){
        action_button.innerHTML = "executed";
        action_button.setAttribute("disabled","");
        break;
      }else{
        action_button.innerHTML = "execute";
        let onclick_func = "kevin.execute_transaction("+i+")";
        action_button.setAttribute("onclick", onclick_func);
        break;
      }
    }
    action_button.setAttribute("id", index);
    
    //set each row data
    index_td.innerHTML = index;
    recipient_td.innerHTML = recipient_trimed;
    currency_td.innerHTML = currency;
    amount_td.innerHTML = amount;
    confirmations_td.innerHTML = confirmations;
    confirm_by_td.innerHTML = confirm_by_trimed;
    executed_td.innerHTML = executed;
    action_td.appendChild(action_button);

    //build row
    row.appendChild(index_td);
    row.appendChild(recipient_td);
    row.appendChild(currency_td);
    row.appendChild(amount_td);
    row.appendChild(confirmations_td);
    row.appendChild(confirm_by_td);
    row.appendChild(executed_td);
    row.appendChild(action_td);

    //append table
    table.appendChild(row);
  }

  //Loading hook out
  load_btn.innerHTML = btn_origin_text;
  execute_load_btn.innerHTML = btn_origin_text;

  load_btn.removeAttribute("disabled");
  execute_load_btn.removeAttribute("disabled");

}

export async function submit_send_tx(){
  let index = await document.getElementById('input-token-index').value
  let type = await document.getElementById('input-token-type').value
  let amount = await document.getElementById('input-token-amount').value
  let recipient = await document.getElementById('input-token-recipient').value

  //check index validity if yes-> alert and break
  let tx_count = await get_transaction_count();
  if(index != tx_count){
    alert("check your Index again!");
    return
  }

  //convert type to token address
  let token_address = token_to_address(type);

  //TODO : check multisig balance and alert

  //convert amount to wei(string)
  let amount_wei = ethers.utils.parseEther(amount).toString();
  let amount_unit6 = ethers.utils.parseUnits(amount, 6).toString();
  // console.log(amount_wei);
  let amount_tx;
  if(type == "TON"){
    amount_tx = amount_wei;
  } else {
    amount_tx = amount_unit6;
  }


  //check recipient address validity if yes -> alert and break
  let is_address = ethers.utils.isAddress(recipient);
  if(is_address == false){
    alert("Invalid address : " + recipient);
  }

  let confirm_message = `Are you sure to submit transaction?
  1.Index    : ${index}
  2.Token    : ${type}
  3.Amount   : ${amount}
  4.Recipient: ${recipient}
  `;
  ;

  //confirm check index, type, amount, recipient again, click confirm
  if(confirm(confirm_message) == true){
    //submit transaction
    await submit_transaction(recipient, amount_tx, token_address);
  }
}


///////////////setting related functions///////////


export async function load_master(){
  const customProvider = new ethers.providers.JsonRpcProvider(NETWOROK_URL);
  // let _balance = await token.balanceOf(_target);
  const multisig = new ethers.Contract(MULTISIG_ADDRESS, multisig_abi, customProvider);
  let master = await multisig.master.call()
  // console.log(master);

  let master_div = document.getElementById("master-div");
  let master_btn = document.getElementById("btn-load-master");
  let master_addrs_div = document.createElement("div");
  master_addrs_div.setAttribute("id", master);
  master_addrs_div.innerHTML = master;
  
  // console.log(master_addrs_div);
  master_div.replaceChild(master_addrs_div, master_btn);
  master_div.appendChild(master_addrs_div);
}

export async function load_owners_list(){
  let owners_div = document.getElementById("owners_div");
  let owners_btn = document.getElementById("btn-load-owners");
  
  let owners_list_ol = document.createElement("ol");
  owners_list_ol.setAttribute("id","list-owners");

  let owners = await get_multisig_owners();

  for(let i=0; i<owners.length; i++){
    let owner_li = document.createElement("li");
    owner_li.innerHTML = owners[i];
    owner_li.setAttribute("id", "owner-"+(i+1));
    owners_list_ol.appendChild(owner_li);
  }

  // owners_div.replaceChild(owners_list_ul, owners_btn);
  owners_btn.replaceWith(owners_list_ol);
}

export async function send_change_owner(){
  let slot = await document.getElementById('input-owners-slot').value;
  let new_owner = await document.getElementById('input-new-owner').value;

  if(ethers.utils.isAddress(new_owner) == false){
    alert("Invalid Address");
    return;
  }

  let confirm_message = `
  Are you sure to change owner?
  1. Slot : ${Number(slot)+1}
  2. New Owner : ${new_owner}
  `;

  if(confirm(confirm_message)){
    let change_owner_tx = await change_owner(slot, new_owner);
  }else{
    return;
  }
  
}

export async function send_change_master(){
  let new_master = await document.getElementById('input-new-master').value;

  if(ethers.utils.isAddress(new_master) == false){
    alert("Invalid Address");
    return;
  }

  let confirm_message = `
  Are you sure to change master?
  New Master : ${new_master}
  `;

  if(confirm(confirm_message)){
    let change_master_tx = await change_master(new_master);
  }else{
    return;
  }
}

export async function load_num_confirmations(){
  const customProvider = new ethers.providers.JsonRpcProvider(NETWOROK_URL);
  // let _balance = await token.balanceOf(_target);
  const multisig = new ethers.Contract(MULTISIG_ADDRESS, multisig_abi, customProvider);
  let num_confirmations = await multisig.numConfirmationsRequired.call()
  // console.log(master);

  let change_conf_div = document.getElementById("change-confirmations-div");
  let load_conf_btn = document.getElementById("btn-load-confirmatoins");
  let loaded_conf_div = document.createElement("div");
  loaded_conf_div.setAttribute("id", "num-of-confirmations");
  loaded_conf_div.innerHTML = num_confirmations;
  
  // console.log(master_addrs_div);
  change_conf_div.replaceChild(loaded_conf_div, load_conf_btn);
}

export async function send_change_confirmations(){
  let new_confirmations = await document.getElementById('input-new-confirmations').value;

  let num_new_confirms = Number(new_confirmations);

  if(num_new_confirms<1 && num_new_confirms>3){
    alert("Confirmations must be between 1-3");
    return;
  }

  let confirm_message = `
  Are you sure to change num required approvals?
  New Approvals Required : ${num_new_confirms}
  `;

  if(confirm(confirm_message)){
    let change_confirms_tx = await change_confirmations(num_new_confirms);
  }else{
    return;
  }
}