const data = document.querySelectorAll(".btn");

const years = document.querySelector(".years");
const months = document.querySelector(".months");
const days = document.querySelector(".days");

const calc_btn = document.querySelector(".calcbtn");

const errors = document.querySelectorAll(".error");
const fields = document.querySelectorAll(".uninialized");

const titles = document.querySelectorAll(".title");

errors.forEach((error) => {error.hidden = true;});
fields.forEach((field) => {field.hidden = true;});

let date_of_birth = {};

data.forEach((el) => {
    el.addEventListener("blur", () => {
        date_of_birth[el.id] = Number(el.value);
    });
});

function hide_or_show(el){el.hidden = !el.hidden;}

function list_process(list, class_name){
    list.forEach((el) => {
        if(el.className === class_name){ 
            hide_or_show(el);
            return;
        }
    });
}

function check_leap_year(year){
    if(year % 4 != 0 || (year % 100 == 0 && year % 400 != 0)) return 28;
    return 29;
}

function error_sign(){
    data.forEach((input_field) => {
        input_field.style.borderColor = "red";
    });

    titles.forEach((title) => {
        title.style.color = "red";
    });
}

function clear_error_sign(){
    data.forEach((input_field) => {
        input_field.style.borderColor = "hsl(0, 0%, 86%)";
    });

    titles.forEach((title) => {
        title.style.color = "hsl(0, 1%, 44%)";
    });
}


calc_btn.addEventListener("click", () => {
    let date1 = new Date();

    if(Object.keys(date_of_birth).length == 0){
        fields.forEach((field) => hide_or_show(field));
        error_sign();
        return;
    }

    let date_of_birth_length = Object.keys(date_of_birth).length;
    let check_variable = true;
    for(let x of Object.values(date_of_birth)){
        if(x == 0) {
            check_variable = false;
            break;
        }
    }

    if(date_of_birth_length != 3 || !check_variable){
        if(!date_of_birth.hasOwnProperty('day') || date_of_birth.day == 0){
            list_process(fields, "uninialized day");
        }
        if(!date_of_birth.hasOwnProperty('month') || date_of_birth.month == 0){
            list_process(fields, "uninialized month");
        }
        if(!date_of_birth.hasOwnProperty('year') || date_of_birth.year == 0){
            list_process(fields, "uninialized year");
        }

        error_sign();
        
        years.innerHTML = `<span id="output">-- </span>years`;
        months.innerHTML = `<span id="output">-- </span>months`;
        days.innerHTML = `<span id="output">-- </span>days`;
        return;
    }
    

    let date2 = new Date(date_of_birth.year, date_of_birth.month - 1, date_of_birth.day);
    
    let num_of_days, num_of_months;

    let days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    days_in_month[1] = check_leap_year(date_of_birth.year);

    {
        check_variable = false;
        if(date_of_birth.month > 12 || date_of_birth.month < 1) {
            list_process(errors, "error month");
            check_variable = true;
        }
        if(date_of_birth.day < 1 || date_of_birth.day > days_in_month[date_of_birth.month - 1]) {
            list_process(errors, "error day");
            check_variable = true;
        }
        if(date_of_birth.year > date1.getFullYear()){ 
            list_process(errors, "error year");
            check_variable = true;
        }
        if(date_of_birth.year == date1.getFullYear() && (date_of_birth.month - 1 > date1.getMonth() || (date_of_birth.month - 1 == date1.getMonth() && date_of_birth.day > date1.getDate()))) {
                list_process(errors, "error month");
                list_process(errors, "error day");
                check_variable = true;
            }
        if(check_variable == true) {
            years.innerHTML = `<span id="output">-- </span>years`;
            months.innerHTML = `<span id="output">-- </span>months`;
            days.innerHTML = `<span id="output">-- </span>days`;
            error_sign();
            return;
        }
    }

    errors.forEach((error) => {error.hidden = true;});
    fields.forEach((field) => {field.hidden = true;});

    clear_error_sign();

    let num_of_years = Math.floor((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24 * 365));

    if(num_of_years != date1.getFullYear() - date_of_birth.year){
        if(date1.getDate() > date_of_birth.day){
            num_of_months = 12 - (date1.getMonth() + 1 - date_of_birth.month);
            num_of_days = date1.getDate() - date_of_birth.day;
        }
        else if(date1.getDate() < date_of_birth.day){
            num_of_months = 12 - (date1.getMonth() + 1 - date_of_birth.month) - 1;
            num_of_days = days_in_month[date1.getMonth() - 1] - date_of_birth.day + date1.getDate();
        }
        else{
            num_of_months = 12 - (date1.getMonth() + 1 - date_of_birth.month);
            num_of_days = 0;
        }
    }
    else{
        if(date1.getDate() > date_of_birth.day){
            num_of_months = date1.getMonth() + 1 - date_of_birth.month;
            num_of_days = date1.getDate() - date_of_birth.day;
        }
        else if(date1.getDate() < date_of_birth.day){
            if(date_of_birth.month - 1 == 0) num_of_months = date1.getMonth() - date_of_birth.month + 1;
            else num_of_months = date1.getMonth() - date_of_birth.month;
            num_of_days = days_in_month[date1.getMonth() - 1] - date_of_birth.day + date1.getDate();
            console.log(days_in_month[date1.getMonth() - 1]);
        }
        else{
            num_of_months = date1.getMonth() + 1 - date_of_birth.month;
            num_of_days = 0;
        }
    }

    years.innerHTML = `<span id="output">${num_of_years} </span>years`;
    months.innerHTML = `<span id="output">${num_of_months} </span>months`;
    days.innerHTML = `<span id="output">${num_of_days} </span>days`;
});

