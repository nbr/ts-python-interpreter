import dis

def main():
  dis.dis(func)

def func(i):
  return i+1

if __name__=='__main__':
  main()
