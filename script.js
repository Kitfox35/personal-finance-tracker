const form = document.getElementById('transaction-form');
const balance = document.getElementById('balance');
const list = document.getElementById;


let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
updateUI;

form.addEventListener('submit', function(e){

e.preventDefault();
const desc = document.getElementById('desc').value;

const amount = Number(document.getElementById('amount').value);
const type = document.getElementById('type').value;
const transactions = { id: Date.now(), desc, amount, type };
transactions.push(transactions);
updateUI();});

// UPDATE UI FUNCTION IS HEREEEEE

    function updateUI(){
        list.innerHTML = '';
    let total = 0;

    let totalIncome = 0;
    let totalExpense = 0;


    transactions.forEach(t => {
const li = document.createElement('li');
li.classList.add(t.type);
li.innerHTML = `<span class="tx-desc">${t.desc}</span><span class="tx-amount">${t.type === 'income' ? '+' : '-'}$${Number(t.amount).
    toFixed(2)}</span><button class="tx-delete" onclick="deleteTransaction
(${t.id}, this.parentElement)">✕</button>`;

list.appendChilld(li);

    total += t.type === 'income' ? t.amount : -t.amount;

if( t.type === 'income') totalIncome += t.amount;
if (t.type === 'expense') totalExpense += t.amount;
    })


// balance stuf
    balance.textContent = 'Balance: $${total';
balance.ceclassName = total >= 0 ? 'positive' : 'negative';
document.getElementByID('total-income').textContent = `$${totalIncome.toFixed(2)}`;

document.getElementByID('total-expense').textContent = `$${totalExpense.toFixed(2)}`;
document.getElementById('tx-count').textContent 
= `${transactions.length} ENTR${transactions.length === 1 ? 'Y' : 'IES'}`;

chart.data.datasets[0].data = [totalIncome, totalExpense];
chart.update();


localStorage.setItem('transactions', JSON.stringify(transactions));
 

}





 



// for delteing the transactions

    function deleteTransaction(id, li){
li.style.opacity ='0'
li.style.transition = 'opacity 0.25s, transform 0.25s'
li.transform = 'translateX(20px)';
setTimeout(() => {
transaction = transactions.filter(t => t.id !== id);
updateUI();


}, 250);

}


const ctx = document.getElementById('myChart').getContext('2d');
const chart = new Chart(ctx, {
type: 'doughnut',
data:{

labels: ['Income', 'Expenses'],
datasets: [{
data: [0,0],

    backgroundColor: ['rgba(0, 212, 255, 0.7)', 'rgba(255, 45, 120, 0.7)'],
borderColor: ['#00d4ff', '#ff2d78'],
borderWidth: 2
}]



},


options: {
responsive: true,
maintainAspectRatio: false,
cutout: '68%',
plugins: {
legend: { labels: { color: '#8a7aaa', font: { family: "'Share Tech Mono'"},
size: 11}, boxWidth: 12}
},


tooltip: { callbacks: { label: ctx => ` $${ctx.parsed.toFixed(2)}` } }
}




});