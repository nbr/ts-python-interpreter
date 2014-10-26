Build python2.7.6
```bash
cd doc/Python-2.7.6
./configure --with-pydebug
make -s -j2 #some modules may not build, but we may not need them
sudo apt-get install cgdb
cgdb ./python
```
Now you can see the source!
Add a breakpoint on PyFrame_New.
```
break Objects/frameobject.c:624
```
Run a pyc file.
```
run ../../sample_pycs/helloworld2.pyc
```
