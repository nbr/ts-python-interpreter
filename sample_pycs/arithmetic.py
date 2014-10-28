def main():
    print addIntInt(1, 2)
    print addIntBool(1, True)
    print addBoolInt(False, 5)
    print addBfloatInt(3.4, 2)
    print addBfloatInt(1.0, 2)
    print addIntBfloat(2, 3.4)
    print addIntBfloat(2, 1.0)
    print addStringString('a', 'b')

def addIntInt(x, y):
    return x + y
def addIntBool(x, y):
    return x + y
def addBoolInt(x, y):
    return x + y
def addBfloatInt(x, y):
    return x + y
def addIntBfloat(x, y):
    return x + y
def addStringString(x, y):
    return x + y

main()
