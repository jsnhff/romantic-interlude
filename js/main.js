var book;
var home = $("#js-romance");
var line_break = /\n/gi; // A global regex to replace linebreaks
var double_break = /<br><br>/gi; // A global regex to replace linebreaks
var triple_break = /<br><br><br>/gi; // A global regex to replace linebreaks
var height_count = 0; // A global height measure to help animate lines 
var top_margin = 0; // A global top margin variable to help track incremental top margin increase
var total_height = 0;
var previous_height = 0;
var previous_height_count = 0;
var single_word_height = 0;
var tota_word_count = 0;
//var unique_random_numbers = [];
var books = ['the_notebook','the_longest_ride'];

var server_path = "/romantic-interlude/"
//var server_path = ""

function randomUniqueNums(limit, amount, lower_bound, upper_bound) {
    // Example, including customisable intervals [lower_bound, upper_bound)
    // Thanks: http://goo.gl/MXgFbn
    var limit = limit,
        amount = amount,
        lower_bound = lower_bound,
        upper_bound = upper_bound,
        unique_random_numbers = [];

    if (amount > limit) limit = amount; // Infinite loop if you want more unique
    // Natural numbers than existemt in a given range
    while (unique_random_numbers.length < limit) {
        var random_number = Math.round(Math.random()*(upper_bound - lower_bound) + lower_bound);
        if (unique_random_numbers.indexOf(random_number) == -1) { 
            // Yay! new random number
            unique_random_numbers.push( random_number );
        }
    }

    return unique_random_numbers;
}

// Add random body parts
function addBodyParts(book_path) {
    // Make some unique random nums
    random_part_nums = randomUniqueNums(5,3,1,5);

    $(".image").each(function(index, value){
        console.log(random_part_nums[index]);
        $(this).find("img").attr("src",server_path+"/img/"+book_path+"/"+random_part_nums[index]+".png");
    });
}

// Get book from text file
function loadBook() {
    // Show the wrapper and reset vars to default states
    $("#wrapper").show();
    height_count = 0;
    top_margin = 0;
    total_height = 0;
    previous_height = 0;
    previous_height_count = 0;
    total_word_count = 0;

    // Choose a random book
    random_book_num = (Math.floor(Math.random() * books.length ));
    // Choose corresonponding image folder
    random_image_folder = books[random_book_num];
    // Load random images
    addBodyParts(random_image_folder);

    $.ajax({
        url : server_path+"/books/"+books[random_book_num]+".txt",
        dataType: "text",
        success : function (data) {
            book = data.replace(line_break, "<br>"); // Replace linebreaks
            book = book.replace(triple_break, "<br> "); // Replace linebreaks
            book = book.replace(double_break, "<br> "); // Replace linebreaks
            book = book.split(' '); // Split on space
            write(book);
        }
    });
}

// Add words from book to HTML, keeping them hidden
function write(book){
    // Clear writing space
    home.html('');

    // Add the words
    for (i = 0; i < book.length; i++) {
        var word_wrapped = " <span class='word' style='display:none;'>"+book[i]+"</span>"; 
        home.append(word_wrapped);
    }

    // Words can only be shown after they been added to the DOM,
    // which happens after they've been loaded by ajax
    showWords();
}

// Fade each word in slowly, one after the other
function showWords() {
    total_word_count = $(".word").length;
    $(".word").each(function(index, element){
        var text = $(element).html();
        var delay = index*1500;

        $(element).delay(delay).fadeIn(1000, function(){
            total_height = $("#js-romance").height();
            single_word_height = 68; // 68 because using inline-block removes brs

            if(height_count == 0) {
                height_count = 1;
                previous_height = total_height;
            } else if(total_height > previous_height) {
                previous_height = total_height;
                height_count = height_count+1;
                if(height_count == 4){
                    top_margin = top_margin-single_word_height;
                    $("#js-romance").css("margin-top",top_margin+"px");
                    previous_height_count = height_count;
                } else if(height_count > 4 && height_count > previous_height_count) {
                    previous_height_count = height_count;
                    top_margin = top_margin-single_word_height;
                    $("#js-romance").css("margin-top",top_margin+"px");
                }
            } else {
                //console.log("Same height or less than 3");
            }
            // Fade everything out after you reach the final word
            if (index == total_word_count-1) {
                $("#wrapper").fadeOut(3000, function(){
                    home.css("margin-top","0"); 

                    // Hide all the words that were faded in
                    $(".word").each(function(){
                        $(this).hide(); 
                    });

                    // Start it all over
                    console.log("start over");
                    loadBook();
                });
            }
        });

    });
}

loadBook();
