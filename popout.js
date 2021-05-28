// create new expenses
document.querySelector('.create').addEventListener('click', function(){
    document.querySelector('.new-item').style.display='flex';
    document.querySelector('.create').style.display='none';
    document.querySelector('.cancel').style.display='block';
});

// cancel creating new expenses
document.querySelector('.cancel').addEventListener('click', function(){
    document.querySelector('.new-item').style.display='none';
    document.querySelector('.create').style.display='block';
    document.querySelector('.cancel').style.display='none';
});

// edit the budget
document.querySelector('.edit').addEventListener('click', function(){
    document.querySelector('.new-budget').style.display='block';
    document.querySelector('.edit').style.display='none';
    document.querySelector('.x_sign').style.display='block';
});

// cancel editing the budget
document.querySelector('.x_sign').addEventListener('click', function(){
    document.querySelector('.new-budget').style.display='none';
    document.querySelector('.edit').style.display='block';
    document.querySelector('.x_sign').style.display='none';
});

// edit the date
document.querySelector('.date').addEventListener('click', function(){
    document.querySelector('.new-date').style.display='block';
    let date = localStorage.getItem('date');
    let dateVal = JSON.parse(date);
    const dateText = document.querySelector('.date');
    dateText.innerHTML=`<input class="new-date" type ="text" value=${dateVal} id="newDate">`;
});

// complete editing the date when enter is pressed
document.getElementById("newDate").addEventListener("keydown",function(event) {
    if (event.keyCode == 13){
        let date = document.querySelector('.dateContainer input').value;
        if (date != '') {
            changeDate();
        } else {
            alert("Please enter a budget starting date.")
        }
    
    }
}, false);

// complete editing the date when outside the box is clicked
window.addEventListener('click', function(e){   
    if (document.getElementById('date-container').contains(e.target)){
      // Clicked in box
    } else{
        let date = document.querySelector('.dateContainer input').value;
        if (date != '') {
            changeDate();
        } else {
            alert("Please enter a budget starting date.")
        }
    }
  });

// change the date
function changeDate(){
    let date = document.querySelector('.dateContainer input').value;
    document.querySelector('.new-date').style.display='none';
    const dateText = document.querySelector('.date');
    saveDate(date);
    dateText.innerHTML=date;
}

// change the budget
document.querySelector('.add-budget').addEventListener('click', function(){
    document.querySelector('.new-budget').style.display='none';
    document.querySelector('.edit').style.display='block';
    document.querySelector('.x_sign').style.display='none';
    let budgetValue = document.querySelector('.new-budget input').value;
    if (budgetValue != '' && !isNaN(budgetValue)) {
        console.log(budgetValue);
        const budgetText = document.querySelector('.budgetAmount');
        budgetText.innerHTML=budgetValue;
        saveBudget(budgetValue);
        fetchItems();
    }
});

// add a new expense
document.querySelector('.new-item button').addEventListener('click', function() {
    let itemName = document.querySelector('.new-item input').value;
    let category = document.querySelector('.new-item select').value;
    let categoryStorage = localStorage.getItem('category');
    let categoryArr = JSON.parse(categoryStorage);
    let itemsStorage = localStorage.getItem('content');
    let itemsArr = JSON.parse(itemsStorage);
    if (itemName != '' && !isNaN(itemName)) {
        let length = categoryArr.length
        let exist = false
        for (i=0; i < length; i++) {
            if (categoryArr[i] == category) {
                console.log(itemName)
                console.log(itemsArr[i].item)
                let num = parseFloat(itemsArr[i].item) + parseFloat(itemName)
                itemsArr[i].item = num
                console.log(itemsArr[i])
                saveItems(itemsArr);
                exist = true
            }
        };
        if (exist == false) {
            // add to the expense list
            itemsArr.unshift({"item": itemName, "status":0});
            saveItems(itemsArr);
            
            // add to the category list
            categoryArr.unshift(category);
            saveCategory(categoryArr);
        }
        
        fetchItems();

        // resets the input box and change the display
        document.querySelector('.new-item input').value = '';
        document.querySelector('.new-item').style.display='none';
        document.querySelector('.create').style.display='block';
        document.querySelector('.cancel').style.display='none';
    }
});


function fetchItems() {
    const itemsList = document.querySelector('ul.content');
    const spendingText = document.querySelector('.spending');
    const dateText = document.querySelector('.date');
    itemsList.innerHTML='';
    spendingText.innerHTML='';
    let newItemHTML = '';
    const budgetText = document.querySelector('.budgetAmount');
    try {
        let items = localStorage.getItem('content');
        let itemsArr = JSON.parse(items);
        let categories = localStorage.getItem('category');
        let categoriesArr = JSON.parse(categories);
        let date = localStorage.getItem('date');
        let dateVal = JSON.parse(date);
        let budgetStorage = localStorage.getItem('budget');
        let budget = JSON.parse(budgetStorage);
        let sum = 0;
        for (var i=0; i<itemsArr.length;i++) {
            sum += parseFloat(itemsArr[i].item);    // calculate the sum
            let status ='';
            if(itemsArr[i].status == 1) {
                status = 'class="done"';
            }
            newItemHTML += `<li data-itemindex="${i}" ${status}>
            <div class="item">$ ${itemsArr[i].item}</div>
            <div class="itemCat">${categoriesArr[i]}</div>
            <div class="itemDelete"><img src="image/garbage.png"></div>
            </li>`;
        }

        // display the texts responsive
        itemsList.innerHTML=newItemHTML;
        spendingText.innerHTML="$" + sum.toString();
        budgetText.innerHTML=budget;
        dateText.innerHTML=dateVal;

        // change the filled percentage & color of the donut chart
        let piPercent = 180 * sum / budget;
        if (piPercent >= 180) {
            piPercent = 180;
        }
        if (piPercent >= 130 && piPercent < 150) {
            colorCode = '#ebb434';
        } else if (piPercent >= 150) {
            colorCode = '#e84c43';
        } else {
            colorCode = '#4DAF7C';
        }
        document.querySelector('.bar').style.borderColor=`${colorCode}`;
        document.querySelector('.bar').style.borderTop='none';
        document.querySelector('.semi-donut-model').style.color=`${colorCode}`;
        document.querySelector('.bar').style.transform = `rotate( calc( 1deg * (${piPercent} ) ) )`;
        
        // to itemDelete(index) if the delete icon is clicked
        var itemsListUL = document.querySelectorAll('ul li');
        for (var i = 0; i < itemsListUL.length; i++) {
            itemsListUL[i].querySelector('.itemDelete img').addEventListener('click', function() {
                let index = this.parentNode.parentNode.dataset.itemindex;
                itemDelete(index);
            });
        }
    } catch(e){
        // error
    }
}

function saveItems(obj) {
    let string = JSON.stringify(obj);
    localStorage.setItem('content', string);
}

function saveBudget(obj) {
    let string = JSON.stringify(obj);
    localStorage.setItem('budget', string);
}

function saveCategory(obj) {
    let string = JSON.stringify(obj);
    localStorage.setItem('category', string);
}

function saveDate(obj) {
    let string = JSON.stringify(obj);
    localStorage.setItem('date', string);
}

function itemDelete(index) {
    // delete the corresponding category
    let categories = localStorage.getItem('category');
    let categoriesArr = JSON.parse(categories);
    categoriesArr.splice(index, 1);
    saveCategory(categoriesArr);

    // delete the expense from the expense list
    let itemsStorage = localStorage.getItem('content');
    let itemsArr = JSON.parse(itemsStorage);
    const spendingText = document.querySelector('.spending');
    spendingText.innerHTML=''
    itemsArr.splice(index, 1);
    saveItems(itemsArr);
    document.querySelector('ul.content li[data-itemindex="'+index+'"]').remove();

    // recalculate the sum
    let sum = 0; 
    for (var i=0; i<itemsArr.length;i++) {
        sum += parseInt(itemsArr[i].item);
    }
    spendingText.innerHTML="$" + sum.toString();
    
    fetchItems();
}

fetchItems();