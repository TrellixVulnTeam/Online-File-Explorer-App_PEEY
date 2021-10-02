const content = [];

//sort status
let nameOrder;
let sizeOrder;
let timeOrder;

//loop through children of body
$("tbody tr").each(function(){
    const file = {
        name: $(this).attr("data-name"),
        size: parseFloat($(this).attr("data-size")),
        time: parseInt($(this).attr("data-time")),
        html: $(this).prop("outerHTML")
    };
    content.push(file);
});

//create a function to fill table body and add icon at header after sorting
function changeHeadBody(order, header)
{
    let nameHTML;
    if(header == "#nameHeader")
    {
        nameHTML = "Name";
    }
    else if(header == "#sizeHeader")
    {
        nameHTML = "Size";
    }
    else
    {
        nameHTML = "Last Modified";
    }
    $("th ion-icon").remove();

    if(!order || order == "descend")
    {
        const newBody = content.map(file => file.html).join('');
        $("tbody").html(newBody);
        $(`${header}`).html(`${nameHTML} <ion-icon name="arrow-up-circle-outline"></ion-icon>`);
    }
    else
    {
        content.reverse();
        const newBody = content.map(file => file.html).join('');
        $("tbody").html(newBody);
        $(`${header}`).html(`${nameHTML} <ion-icon name="arrow-down-circle-outline"></ion-icon>`);
    }
}

//sort by names
$("#nameHeader").click(function(){
    content.sort((file1, file2) => {
        if(file1.name.toLowerCase() < file2.name.toLowerCase())
        {
            return -1;
        }
        else if(file1.name.toLowerCase() > file2.name.toLowerCase())
        {
            return 1;
        }
        else
        {
            return 0;
        }
    });
    changeHeadBody(nameOrder, "#nameHeader");
    nameOrder = !nameOrder || nameOrder == "descend" ? "ascend" : "descend";
});


//sort by size
$("#sizeHeader").click(function(){
    content.sort((file1, file2) => {
        if(file1.size < file2.size)
        {
            return -1;
        }
        else if(file1.size > file2.size)
        {
            return 1;
        }
        else
        {
            return 0;
        }
    });
    changeHeadBody(sizeOrder, "#sizeHeader");
    sizeOrder = !sizeOrder || sizeOrder == "descend" ? "ascend" : "descend";
});

//sort by time
$("#timeHeader").click(function(){
    content.sort((file1, file2) => {
        if(file1.time < file2.time)
        {
            return -1;
        }
        else if(file1.time > file2.time)
        {
            return 1;
        }
        else
        {
            return 0;
        }
    });
    changeHeadBody(timeOrder, "#timeHeader");
    timeOrder = !timeOrder || timeOrder == "descend" ? "ascend" : "descend";
});