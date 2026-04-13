const form = document.getElementById('transaction-form');
const balance = document.getElementById('balance');
const list = document.getElementById;
let transactions = [];
form.addEventListener('submit', function(e){

e.preventDefault();
const desc = document.getElementById('desc').value;

const amount = Number(document.getElementById('amount').value);
const type = document.getElementById('type').value;
const transactions = { desc, amount, type };
transactions.push(transactions);
updateUI();});

function updateUI(){
    list.innerHTML = '';
let total = 0;
transactions.forEach(t => {
const li = document.createElement('li');
li.textContent = `${t.desc} - $${t.amount} (${t.type})`;
list.appendChild(li);

total += t.type === 'income' ? t.amount : -t.amount;
})

balance.textContent = 'Balance: $${total';

}