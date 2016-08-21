var book;
var home = $("#js-romance");
var line_break = /\n/gi; // A global regex to replace linebreaks
var double_break = /<br><br>/gi; // A global regex to replace linebreaks
var height_count = 0; // A global height measure to help animate lines 
var top_margin = 0; // A global top margin variable to help track incremental top margin increase
var total_height = 0;
var previous_height = 0;
var previous_height_count = 0;
var single_word_height = 0;
var tota_word_count = 0;

// Get book from text file
function loadBook() {
    console.log("load book");
    // Show the wrapper and reset vars to default states
    $("#wrapper").show();
    height_count = 0;
    top_margin = 0;
    total_height = 0;
    previous_height = 0;
    previous_height_count = 0;
    total_word_count = 0;

    // Choose a random book
    // Choose corresonponding image folder
    // Load random images

    $.ajax({
        url : "/books/the_notebook.txt",
        dataType: "text",
        success : function (data) {
            book = data.replace(line_break, "<br>"); // Replace linebreaks
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
