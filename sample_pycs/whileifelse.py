def phw(a,b):

    greeted = " "
    while(greeted != "Hello World"):
        print "Looping"
        if("abc" == "abcd"):
            print b
        else:
            greeted = "Hello World"
    if(greeted == "Hello World"):
        print b

# should print 1
phw("Hello World", 1)
