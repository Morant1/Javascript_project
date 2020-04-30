//BUDGET CONTROLLER
var budgetController = (function() {
    
   var Expense = function(id,description,value) {
       this.id = id;
       this.description = description;
       this.value = value;
       this.precentage = -1;
   };
   
    
    Expense.prototype.calcPrecentage = function(totalIncome) {
        
        if (totalIncome>0) {
            
        this.precentage = Math.round((this.value / totalIncome)*100);
        
        } else {
            
            this.precentage = -1;
        }
        
    };
    
    Expense.prototype.getPrecentage = function() {
        return this.precentage;
    };
    
   
   var Income = function(id,description,value) {
       this.id = id;
       this.description = description;
       this.value = value;
   };

    var calculateTotal = function(type) {
        var sum = 0;
        
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
        
        
        
    };
    
    
    
   
   //storing incomes and expenses 
    
    var data = {
        allItems: {
            exp: [],
            inc: [],
            
            
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
        
    };
    
    return {
        
        addItem: function(type,des,val) {
            var newItem,ID;
            
             //unique nu. to assign to any new exp/inc
            //ID = last ID +1
            
            // Create new ID
            if (data.allItems[type].length >0) {
            ID = data.allItems[type][data.allItems[type].length-1].id+1;
            } else {
                ID = 0;
            }
            
            //Create new item based on 'inc' or 'exp' type
            if (type ==='exp'){
                
            newItem = new Expense(ID,des,val);
                
            } else if (type === 'inc') { 
    
               newItem = new Income(ID,des,val); 
            }
            
            //push it into our data structure
            data.allItems[type].push(newItem);
            
            //return the new element
            return newItem;
            
        },
        
        deleteItem: function(type,id) {
            var ids, index;
            
            
            // new list of ids
            var ids = data.allItems[type].map(function(current){
                return current.id;
                
            });
            
            index = ids.indexOf(id);
            
            if (index !== -1) {
                
                data.allItems[type].splice(index,1);
                
            }
            
        },
        
        calculateBudget: function() {
            
            // calculate total income and expenses
            
            calculateTotal('exp');
            calculateTotal('inc');
            
            // calculate the budget : income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            //calculate the % of the income that we spent 
            if (data.totals.inc >0) {
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        
        
        calculatePercentages: function() {
            
            data.allItems.exp.forEach(function(cur) {
                cur.calcPrecentage(data.totals.inc);
                
            });
            
        },
        
        getPrecentages: function() {
            
            var allPrec = data.allItems.exp.map(function(cur){
               return cur.getPrecentage(); 
                
            });
            return allPrec;
            
        },
        
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                precentage: data.percentage
                
            };
            
        },
        
        
        
        testing: function() {
            console.log(data);
        }
    }
    
})(); 





//UI CONSTROLLER
var UIController = (function() {
    
    var Domstrings = {
        inputType: '.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn: '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLebal:'.budget__value',
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        precentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    
      var formatNumber = function(num,type) {
            var numSplit, int, dec;
            // + or - before number
            // exactly 2 decimal points
            // comma separating thr thousands

            num = Math.abs(num);
            num = num.toFixed(2); // exactly 2 decimal points
            numSplit = num.split('.'); //3.45
            int = numSplit[0]; //3
            if (int.length > 3) { // comma separating thr thousands
                int = int.substr(0,int.length-3) + ',' +int.substr(int.length-3,3); 
            
            }
        
            dec = numSplit[1]; //45
          
           if (parseInt(int) !== 0) {
                return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

            } else {
                return  int + '.' + dec;
        }
          
           
      };
    
            //create forEach function for nodelist instead of an array
           var nodeListForEach = function(list,callback) {
               for ( var i =0; i < list.length; i++) {
                   callback(list[i],i);
                   
               }
               
           };
    
    
    return {
        
        getInput: function() {
            
            //how to return 3 variables? create an object and return 3 proprties!
            //we define proprties with ':'
            
            return {
                
            //type = read the value of the type, because it is select option html form
            // we get the 'value=inc/ex'
                
            type: document.querySelector(Domstrings.inputType).value,
            description: document.querySelector(Domstrings.inputDescription).value,
            value: parseFloat(document.querySelector(Domstrings.inputValue).value)
            
            };
            
        },
        
        
        
        addListItem: function(obj,type) {
            var html,newHtml,element;
            //create HTML string 
            if(type === 'inc'){
            element = Domstrings.incomeContainer;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div</div>';
                
            } else if (type === 'exp'){
            element = Domstrings.expensesContainer;    
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            
            
            //replace the placeholder text with actual data
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));
            
            //insert the HTML into the DOM
            
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
            
        },
        
        deleteListItem: function(selectorID) {
            // we can only remove a child element in js --> we move up w parentNode
            var el = document.getElementById(selectorID);
            
            console.log(el.parentNode.nodeName);
            
            el.parentNode.removeChild(el);
            

            
        },
        
         clearFields: function() {
             var fields, fieldsArr;
             
             fields = document.querySelectorAll(Domstrings.inputDescription+', '+Domstrings.inputValue);
             
             fieldsArr = Array.prototype.slice.call(fields); //trick to return an array from a list
             
             fieldsArr.forEach(function(current,index,array){
                 //up to 3 arguments - current,index,array
                current.value = "";
                 
             });
             
             fieldsArr[0].focus();
         },
        
        
         
        displayBudget: function(obj) {
             var type;  
            obj.budget > 0 ? type = 'inc' : type = 'exp';    

            document.querySelector(Domstrings.budgetLebal).textContent = formatNumber(obj.budget,type);
            document.querySelector(Domstrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
            document.querySelector(Domstrings.expensesLabel).textContent = formatNumber(obj.totalExp,'exp');

            
            if (obj.precentage > 0 ) {
                document.querySelector(Domstrings.precentageLabel).textContent = obj.precentage +'%';
                
            } else {
             document.querySelector(Domstrings.precentageLabel).textContent = '----';
                
                
            }
            
        },
        
        displayPercentages: function(precentages) {
            
            var fields = document.querySelectorAll(
            Domstrings.expensesPercLabel); //returns a nodelist cause in Dom tree each element is called a node
            
            

            nodeListForEach(fields,function(current,index){
                
                if(precentages[index] > 0) {
                current.textContent = precentages[index]+ '%';
                } else {
                    current.textContent = '---';
                }
                
                
            });
            
        },
        
        displayMonth: function() {
            


            var now = new Date(); 
            var month = now.toLocaleString('en-US', { month: 'long'});
            var year = now.getFullYear();
            
            document.querySelector(Domstrings.dateLabel).textContent = month + ' ' + year;
        },
        
        changeType: function() {
            
            var fields = document.querySelectorAll(
            Domstrings.inputType + ',' +
            Domstrings.inputDescription + ',' +
            Domstrings.inputValue);
            
            nodeListForEach(fields,function(cur){
                cur.classList.toggle('red-focus');
                
            document.querySelector(Domstrings.inputBtn).classList.toggle('red');
                
            });
        },
        
          getDomstrings: function() {
              return Domstrings;
          }
        
    };
})();









//GLOBAL APP CONTROLLER
var controller = (function(UICtrl,budgetCtrl) {
    
    //Create a function storing our eventslistners
    var setupEventListner = function(){
        
        var DOM = UICtrl.getDomstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress',function(event){
        
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
        
     });
        
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changeType);
    
        
};
    
    
    var updateBudget = function() {
        
        // 1.calculate the budget
        budgetCtrl.calculateBudget();
        
        // 2.return the budget
        var budget = budgetCtrl.getBudget();
        
        // 3.display budget on UI
       UICtrl.displayBudget(budget);
        
        
    };
    
    
    var updatePercentages = function() {
    
        // 1.calculate precentages
        budgetCtrl.calculatePercentages();
        
        //2.read precentages from budget controller
        var precentages = budgetCtrl.getPrecentages();
        //3.update the UI with new precentages
        UICtrl.displayPercentages(precentages);
        
    };
    
    
    
    
    
    var ctrlAddItem = function() {
        
        var input,newItem;
        
    
        // 1. Get the input data
        input = UICtrl.getInput();
        
        if (input.description !== "" && !isNaN(input.value)
           && input.value > 0){

        // 2. add the item to budget controller
        newItem = budgetCtrl.addItem(input.type ,input.description,input.value);
        
        
        // 3. add new item to UI
        UICtrl.addListItem(newItem,input.type);
        
        // 4.clear the field
        UICtrl.clearFields();
        
        // 5.calculate and update budget
        updateBudget();
            
        // 6.calculate and update percentages
        updatePercentages();
            
        }

        
    };
    
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1.delete item from data structure
            budgetCtrl.deleteItem(type,ID);
            
            
            
            //2.delete item from UI
            UICtrl.deleteListItem(itemID);
            
            //3.update and show the new budget
            updateBudget();
            
            //4.calculate and update precentages
            updatePercentages();
            
        }
        
        
        
    };
    
    return {
        init:function(){
            UICtrl.displayMonth();
            UICtrl.displayBudget({
            budget:0,
            totalInc: 0,
            totalExp: 0,
            precentage: -1
            });
            setupEventListner();
        }
    };
    
    
})(UIController,budgetController);

controller.init();








