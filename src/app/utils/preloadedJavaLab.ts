import { Program } from "./types";

export const javaLabPrograms: Program[] = [
  {
    id: 1,
    title: "Factorial of list of numbers",
    shortTitle: "Factorial of list of numbers",
    code: `public class Factorial {
public static void main(String[] args) {
if (args.length == 0) {
System.out.println("Please provide numbers as command line arguments.");
return;
}

for (int i = 0; i < args.length; i++) {
int num = Integer.parseInt(args[i]); // convert string to integer
long fact = 1;
for (int j = 1; j <= num; j++) {
fact *= j;
}

System.out.println("Factorial of " + num + " = " + fact);
}
}
}`,
    shortCode: `public class Factorial {
 public static void main(String[] args) {
  if (args.length == 0) {
   System.out.println("Please provide numbers as command line arguments.");
   return;
  }
  for (int i = 0; i < args.length; i++) {
   int num = Integer.parseInt(args[i]);
   long fact = 1;
   for (int j = 1; j <= num; j++) fact *= j;
   System.out.println("Factorial of " + num + " = " + fact);
  }
 }
}`,
    explanation:
      "Takes numbers from command-line arguments, converts each to int, and prints its factorial using a nested loop.",
    output: `java Factorial 4 5 6

Factorial of 4 = 24
Factorial of 5 = 120
Factorial of 6 = 720`,
  },
  {
    id: 2,
    title: "Prime numbers between two limits",
    shortTitle: "Prime numbers between two limits",
    code: `import java.util.Scanner;
public class PrimeRange {
public static void main(String[] args) {
Scanner sc = new Scanner(System.in);
// input lower and upper limit
System.out.print("Enter lower limit: ");
int lower = sc.nextInt();
System.out.print("Enter upper limit: ");
int upper = sc.nextInt();
System.out.println("Prime numbers between " + lower + " and " + upper + " are:");
// check each number in the range
for (int num = lower; num <= upper; num++) {
if (num <= 1) continue; // skip 0 and 1
int count = 0; // divisor count
// check how many numbers divide num
for (int i = 1; i <= num; i++) {
if (num % i == 0) {
count++;
}
}

// prime has exactly 2 divisors: 1 and itself
if (count == 2) {
System.out.print(num + " ");
}
}
}
}`,
    shortCode: `import java.util.Scanner;
public class PrimeRange {
 public static void main(String[] args) {
  Scanner sc = new Scanner(System.in);
  System.out.print("Enter lower limit: ");
  int lower = sc.nextInt();
  System.out.print("Enter upper limit: ");
  int upper = sc.nextInt();
  System.out.println("Prime numbers between " + lower + " and " + upper + " are:");
  for (int num = lower; num <= upper; num++) {
   if (num <= 1) continue;
   int count = 0;
   for (int i = 1; i <= num; i++) if (num % i == 0) count++;
   if (count == 2) System.out.print(num + " ");
  }
 }
}`,
    explanation:
      "Reads lower and upper limits, counts divisors for each number, and prints values that have exactly two divisors (prime).",
    output: `Enter lower limit: 10
Enter upper limit: 30
Prime numbers between 10 and 30 are:
11 13 17 19 23 29`,
  },
  {
    id: 3,
    title: "Sort array + exception handling",
    shortTitle: "Sort array + exception handling",
    code: `import java.util.*;
public class SortArrayExample {
public static void main(String[] args) {
Scanner sc = new Scanner(System.in);
try {
System.out.print("Enter the number of elements: ");
int n = sc.nextInt();
int[] arr = new int[n];
System.out.println("Enter " + n + " elements:");
for (int i = 0; i < n; i++) {
arr[i] = sc.nextInt();
}

// Display original array
System.out.print("\\nOriginal Array: ");
for (int i = 0; i < n; i++) {
System.out.print(arr[i] + " ");
}

// Sorting in ascending order (using simple comparison)
for (int i = 0; i < n - 1; i++) {
for (int j = i + 1; j < n; j++) {
if (arr[i] > arr[j]) {
int temp = arr[i];
arr[i] = arr[j];
arr[j] = temp;
}
}
}

// Display ascending order
System.out.print("\\nSorted in Ascending Order: ");
for (int i = 0; i < n; i++) {
System.out.print(arr[i] + " ");
}

// Display descending order
System.out.print("\\nSorted in Descending Order: ");
for (int i = n - 1; i >= 0; i--) {
System.out.print(arr[i] + " ");
}
}
catch (InputMismatchException e) {
System.out.println("\\nError: Please enter valid integer values only!");
}
catch (Exception e) {
System.out.println("\\nAn unexpected error occurred: " + e.getMessage());
}
finally {
System.out.println("\\n\\nProgram execution completed.");
sc.close();
}
}
}`,
    shortCode: `import java.util.*;
public class SortArrayExample {
 public static void main(String[] args) {
  Scanner sc = new Scanner(System.in);
  try {
   System.out.print("Enter the number of elements: ");
   int n = sc.nextInt();
   int[] arr = new int[n];
   System.out.println("Enter " + n + " elements:");
   for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
   System.out.print("\\nOriginal Array: ");
   for (int i = 0; i < n; i++) System.out.print(arr[i] + " ");
   for (int i = 0; i < n - 1; i++)
    for (int j = i + 1; j < n; j++)
     if (arr[i] > arr[j]) { int t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
   System.out.print("\\nSorted in Ascending Order: ");
   for (int i = 0; i < n; i++) System.out.print(arr[i] + " ");
   System.out.print("\\nSorted in Descending Order: ");
   for (int i = n - 1; i >= 0; i--) System.out.print(arr[i] + " ");
  } catch (InputMismatchException e) {
   System.out.println("\\nError: Please enter valid integer values only!");
  } catch (Exception e) {
   System.out.println("\\nAn unexpected error occurred: " + e.getMessage());
  } finally {
   System.out.println("\\n\\nProgram execution completed.");
   sc.close();
  }
 }
}`,
    explanation:
      "Reads an array, sorts it with nested comparison, prints ascending and descending order, and handles invalid input with try-catch-finally.",
    output: `Enter the number of elements: 5
Enter 5 elements:
8 3 1 9 4

Original Array: 8 3 1 9 4 
Sorted in Ascending Order: 1 3 4 8 9 
Sorted in Descending Order: 9 8 4 3 1 

Program execution completed.`,
  },
  {
    id: 4,
    title: "String operations",
    shortTitle: "String operations",
    code: `import java.util.*;
public class StringOperations {
public static void main(String[] args) {
Scanner sc = new Scanner(System.in);
// Input two strings
System.out.print("Enter first string: ");
String str1 = sc.nextLine();
System.out.print("Enter second string: ");
String str2 = sc.nextLine();
// 1. Length of strings
System.out.println("\\nLength of first string: " + str1.length());
System.out.println("Length of second string: " + str2.length());
// 2. Concatenation
String concat = str1 + str2;
System.out.println("\\nConcatenation of both strings: " + concat);
// 3. Character access
if (str1.length() > 0)
System.out.println("First character of first string: " + str1.charAt(0));
if (str2.length() > 0)
System.out.println("Last character of second string: " + str2.charAt(str2.length() - 1));
// 4. Substring
if (str1.length() >= 3)
System.out.println("\\nSubstring of first string (0–3): " + str1.substring(0, 3));
// 5. String comparison
System.out.println("\\nString comparison using equals(): " + str1.equals(str2));
// 6. Case conversion
System.out.println("\\nUppercase of first string: " + str1.toUpperCase());
System.out.println("Lowercase of second string: " + str2.toLowerCase());
sc.close();
}
}`,
    shortCode: `import java.util.*;
public class StringOperations {
 public static void main(String[] args) {
  Scanner sc = new Scanner(System.in);
  System.out.print("Enter first string: ");
  String str1 = sc.nextLine();
  System.out.print("Enter second string: ");
  String str2 = sc.nextLine();
  System.out.println("\\nLength of first string: " + str1.length());
  System.out.println("Length of second string: " + str2.length());
  System.out.println("\\nConcatenation of both strings: " + (str1 + str2));
  if (str1.length() > 0) System.out.println("First character of first string: " + str1.charAt(0));
  if (str2.length() > 0) System.out.println("Last character of second string: " + str2.charAt(str2.length() - 1));
  if (str1.length() >= 3) System.out.println("\\nSubstring of first string (0–3): " + str1.substring(0, 3));
  System.out.println("\\nString comparison using equals(): " + str1.equals(str2));
  System.out.println("\\nUppercase of first string: " + str1.toUpperCase());
  System.out.println("Lowercase of second string: " + str2.toLowerCase());
  sc.close();
 }
}`,
    explanation:
      "Demonstrates common String methods: length, concat, charAt, substring, equals, toUpperCase, and toLowerCase.",
    output: `Enter first string: Hello
Enter second string: World

Length of first string: 5
Length of second string: 5

Concatenation of both strings: HelloWorld
First character of first string: H
Last character of second string: d

Substring of first string (0–3): Hel

String comparison using equals(): false

Uppercase of first string: HELLO
Lowercase of second string: world`,
  },
  {
    id: 5,
    title: "Area of geometrical figures using methods",
    shortTitle: "Area of geometrical figures",
    code: `import java.util.Scanner;
public class GeometryArea {
// Method to calculate area of circle
static double areaCircle(double radius) {
return 3.14159 * radius * radius;
}
// Method to calculate area of rectangle
static double areaRectangle(double length, double width) {
return length * width;
}
// Method to calculate area of triangle
static double areaTriangle(double base, double height) {
return 0.5 * base * height;
}

public static void main(String[] args) {
Scanner sc = new Scanner(System.in);
System.out.println("Choose the figure to calculate area:");
System.out.println("1. Circle");
System.out.println("2. Rectangle");
System.out.println("3. Triangle");
System.out.print("Enter your choice (1-3): ");
int choice = sc.nextInt();
switch (choice) {
case 1:
System.out.print("Enter radius of circle: ");
double r = sc.nextDouble();
System.out.println("Area of Circle: " + areaCircle(r));
break;
case 2:
System.out.print("Enter length of rectangle: ");
double l = sc.nextDouble();
System.out.print("Enter width of rectangle: ");
double w = sc.nextDouble();
System.out.println("Area of Rectangle: " + areaRectangle(l, w));
break;
case 3:
System.out.print("Enter base of triangle: ");
double b = sc.nextDouble();
System.out.print("Enter height of triangle: ");
double h = sc.nextDouble();
System.out.println("Area of Triangle: " + areaTriangle(b, h));
break;
default:
System.out.println("Invalid choice! Please enter 1, 2, or 3.");
}

sc.close();
}
}`,
    shortCode: `import java.util.Scanner;
public class GeometryArea {
 static double areaCircle(double r) { return 3.14159 * r * r; }
 static double areaRectangle(double l, double w) { return l * w; }
 static double areaTriangle(double b, double h) { return 0.5 * b * h; }
 public static void main(String[] args) {
  Scanner sc = new Scanner(System.in);
  System.out.println("Choose the figure to calculate area:");
  System.out.println("1. Circle\\n2. Rectangle\\n3. Triangle");
  System.out.print("Enter your choice (1-3): ");
  int choice = sc.nextInt();
  switch (choice) {
   case 1:
    System.out.print("Enter radius of circle: ");
    System.out.println("Area of Circle: " + areaCircle(sc.nextDouble()));
    break;
   case 2:
    System.out.print("Enter length of rectangle: ");
    double l = sc.nextDouble();
    System.out.print("Enter width of rectangle: ");
    System.out.println("Area of Rectangle: " + areaRectangle(l, sc.nextDouble()));
    break;
   case 3:
    System.out.print("Enter base of triangle: ");
    double b = sc.nextDouble();
    System.out.print("Enter height of triangle: ");
    System.out.println("Area of Triangle: " + areaTriangle(b, sc.nextDouble()));
    break;
   default:
    System.out.println("Invalid choice! Please enter 1, 2, or 3.");
  }
  sc.close();
 }
}`,
    explanation:
      "Uses separate methods for circle, rectangle, and triangle area, selected through a switch-case menu.",
    output: `Choose the figure to calculate area:
1. Circle
2. Rectangle
3. Triangle
Enter your choice (1-3): 1
Enter radius of circle: 5
Area of Circle: 78.53975`,
  },
  {
    id: 6,
    title: "Constructor overloading",
    shortTitle: "Constructor overloading",
    code: `class StudentMarks {
int id;
String name;
double marks;
// Default constructor (no parameters)
StudentMarks() {
id = 0;
name = "Unknown";
marks = 0.0;
}

// Constructor with one parameter (int)
StudentMarks(int i) {
id = i;
name = "Not given";
marks = 0.0;
}

// Constructor with two parameters (int, String)
StudentMarks(int i, String n) {
id = i;
name = n;
marks = 0.0;
}

// Constructor with three parameters (int, String, double)
StudentMarks(int i, String n, double m) {
id = i;
name = n;
marks = m;
}

void display() {
System.out.println(id + " " + name + " " + marks);
}

public static void main(String[] args) {
StudentMarks s1 = new StudentMarks(); // No arguments
StudentMarks s2 = new StudentMarks(101); // One argument (int)
StudentMarks s3 = new StudentMarks(102, "Ram"); // Two arguments (int, String)
StudentMarks s4 = new StudentMarks(103, "Sita", 89); // Three arguments (int, String, double)
s1.display();
s2.display();
s3.display();
s4.display();
}
}`,
    shortCode: `class StudentMarks {
 int id; String name; double marks;
 StudentMarks() { id = 0; name = "Unknown"; marks = 0.0; }
 StudentMarks(int i) { id = i; name = "Not given"; marks = 0.0; }
 StudentMarks(int i, String n) { id = i; name = n; marks = 0.0; }
 StudentMarks(int i, String n, double m) { id = i; name = n; marks = m; }
 void display() { System.out.println(id + " " + name + " " + marks); }
 public static void main(String[] args) {
  new StudentMarks().display();
  new StudentMarks(101).display();
  new StudentMarks(102, "Ram").display();
  new StudentMarks(103, "Sita", 89).display();
 }
}`,
    explanation:
      "Shows constructor overloading with 0, 1, 2, and 3 parameters to initialize student id, name, and marks differently.",
    output: `0 Unknown 0.0
101 Not given 0.0
102 Ram 0.0
103 Sita 89.0`,
  },
  {
    id: 7,
    title: "Student report using Applet",
    shortTitle: "Student report using Applet",
    code: `import java.applet.*;
import java.awt.*;
import java.awt.event.*;

/*
<applet code="StudentReportApplet.class" width=500 height=400>
</applet>
*/

public class StudentReportApplet extends Applet implements ActionListener {
Label l1, l2, l3, l4, l5;
TextField t1, t2, t3, t4, t5;
Button b1;
int total;
double percentage;

public void init() {
setLayout(new GridLayout(7, 2));
l1 = new Label("Student Name:");
t1 = new TextField(20);
l2 = new Label("USN:");
t2 = new TextField(20);
l3 = new Label("Subject 1 Marks:");
t3 = new TextField(5);
l4 = new Label("Subject 2 Marks:");
t4 = new TextField(5);
l5 = new Label("Subject 3 Marks:");
t5 = new TextField(5);
b1 = new Button("Generate Report");
b1.addActionListener(this);
add(l1); add(t1);
add(l2); add(t2);
add(l3); add(t3);
add(l4); add(t4);
add(l5); add(t5);
add(b1);
}

public void actionPerformed(ActionEvent e) {
int m1 = Integer.parseInt(t3.getText());
int m2 = Integer.parseInt(t4.getText());
int m3 = Integer.parseInt(t5.getText());
total = m1 + m2 + m3;
percentage = total / 3.0;
repaint();
}

public void paint(Graphics g) {
g.drawString("----- Student Report -----", 50, 250);
g.drawString("Name : " + t1.getText(), 50, 270);
g.drawString("USN : " + t2.getText(), 50, 290);
g.drawString("Total Marks : " + total, 50, 310);
g.drawString("Percentage : " + String.format("%.2f", percentage) + "%", 50, 330);
}
}

/* HTML — StudentReportApplet.html
<html>
<body>
<h2>Student Report Applet</h2>
<applet code="StudentReportApplet.class" width="500" height="400">
</applet>
</body>
</html>

Compile & run:
javac StudentReportApplet.java
appletviewer StudentReportApplet.html
*/`,
    shortCode: `import java.applet.*;
import java.awt.*;
import java.awt.event.*;
public class StudentReportApplet extends Applet implements ActionListener {
 Label l1,l2,l3,l4,l5; TextField t1,t2,t3,t4,t5; Button b1;
 int total; double percentage;
 public void init() {
  setLayout(new GridLayout(7,2));
  l1=new Label("Student Name:"); t1=new TextField(20);
  l2=new Label("USN:"); t2=new TextField(20);
  l3=new Label("Subject 1 Marks:"); t3=new TextField(5);
  l4=new Label("Subject 2 Marks:"); t4=new TextField(5);
  l5=new Label("Subject 3 Marks:"); t5=new TextField(5);
  b1=new Button("Generate Report"); b1.addActionListener(this);
  add(l1);add(t1);add(l2);add(t2);add(l3);add(t3);add(l4);add(t4);add(l5);add(t5);add(b1);
 }
 public void actionPerformed(ActionEvent e) {
  total=Integer.parseInt(t3.getText())+Integer.parseInt(t4.getText())+Integer.parseInt(t5.getText());
  percentage=total/3.0; repaint();
 }
 public void paint(Graphics g) {
  g.drawString("----- Student Report -----",50,250);
  g.drawString("Name : "+t1.getText(),50,270);
  g.drawString("USN : "+t2.getText(),50,290);
  g.drawString("Total Marks : "+total,50,310);
  g.drawString("Percentage : "+String.format("%.2f",percentage)+"%",50,330);
 }
}`,
    explanation:
      "AWT Applet form takes name, USN and three subject marks, then paints total and percentage on Generate Report.",
    output: `----- Student Report -----
Name : Ravi
USN : 1AB23CS001
Total Marks : 240
Percentage : 80.00%

(Run with appletviewer StudentReportApplet.html)`,
  },
  {
    id: 8,
    title: "Bonus using method overriding",
    shortTitle: "Bonus using method overriding",
    code: `//Program to calculate bonus for different Department using overridng
import java.io.*;
abstract class Department
{
double salary,bonus,netsalary;
abstract void calbonus(double salary);
abstract void display();
}

class Accounts extends Department
{
public void calbonus(double sal)
{
salary=sal;
bonus=sal*0.2;
netsalary=salary+bonus;
}

void display()
{
System.out.println("Accounts \\t"+salary+"\\t\\t"+bonus+"\\t"+netsalary);
}
}

class Sales extends Department
{
public void calbonus(double sal)
{
salary=sal;
bonus=sal*0.15;
netsalary=salary+bonus;
}

void display()
{
System.out.println("Sales \\t\\t"+salary+"\\t\\t"+bonus+"\\t"+netsalary);
}
}

class Production extends Department
{
public void calbonus(double sal)
{
salary=sal;
bonus=sal*0.1;
netsalary=salary+bonus;
}

void display()
{
System.out.println("Production \\t"+salary+"\\t\\t"+bonus+"\\t"+netsalary);
}
}

class Bonus
{
public static void main(String args[])
{
int i;
double basic[]={15000,20000,25000};
Department d[]=new Department[20];
d[0]=new Accounts();
d[1]=new Sales();
d[2]=new Production();
System.out.println("Department \\t Basic salary \\t Bonus \\t Salary");
System.out.println("................................................");
for(i=0;i<basic.length;i++)
{
d[i].calbonus(basic[i]);
d[i].display();
}
}
}`,
    shortCode: `abstract class Department {
 double salary,bonus,netsalary;
 abstract void calbonus(double salary);
 abstract void display();
}
class Accounts extends Department {
 public void calbonus(double sal){ salary=sal; bonus=sal*0.2; netsalary=salary+bonus; }
 void display(){ System.out.println("Accounts\\t"+salary+"\\t\\t"+bonus+"\\t"+netsalary); }
}
class Sales extends Department {
 public void calbonus(double sal){ salary=sal; bonus=sal*0.15; netsalary=salary+bonus; }
 void display(){ System.out.println("Sales\\t\\t"+salary+"\\t\\t"+bonus+"\\t"+netsalary); }
}
class Production extends Department {
 public void calbonus(double sal){ salary=sal; bonus=sal*0.1; netsalary=salary+bonus; }
 void display(){ System.out.println("Production\\t"+salary+"\\t\\t"+bonus+"\\t"+netsalary); }
}
class Bonus {
 public static void main(String args[]) {
  double basic[]={15000,20000,25000};
  Department d[]={new Accounts(), new Sales(), new Production()};
  System.out.println("Department\\t Basic salary\\t Bonus\\t Salary");
  System.out.println("................................................");
  for(int i=0;i<basic.length;i++){ d[i].calbonus(basic[i]); d[i].display(); }
 }
}`,
    explanation:
      "Abstract Department with Accounts, Sales, and Production subclasses that override calbonus with different bonus rates.",
    output: `Department 	 Basic salary 	 Bonus 	 Salary
................................................
Accounts 	15000.0		3000.0	18000.0
Sales 		20000.0		3000.0	23000.0
Production 	25000.0		2500.0	27500.0`,
  },
  {
    id: 9,
    title: "Thread, Applet and Graphics — Ball animation",
    shortTitle: "Ball animation applet",
    code: `import java.applet.*;
import java.awt.*;

/*
<applet code="BallAnimation.class" width=500 height=400>
</applet>
*/

public class BallAnimation extends Applet implements Runnable {
int x = 0, y = 50; // Ball position
int dx = 5; // Movement speed
Thread t;

public void init() {
setBackground(Color.white);
}

public void start() {
t = new Thread(this);
t.start();
}

public void run() {
while (true) {
x += dx;
// Reverse direction when hitting edges
if (x > getWidth() - 50 || x < 0) {
dx = -dx;
}

repaint();
try {
Thread.sleep(50); // Slow down animation
} catch (InterruptedException e) {}
}
}

public void paint(Graphics g) {
g.setColor(Color.red);
g.fillOval(x, y, 50, 50); // Draw the ball
}
}

/* HTML — BallAnimation.html
<html>
<body>
<h2>Ball Animation Applet</h2>
<applet code="BallAnimation.class" width="500" height="400">
</applet>
</body>
</html>

Compile & run:
javac BallAnimation.java
appletviewer BallAnimation.html
*/`,
    shortCode: `import java.applet.*;
import java.awt.*;
public class BallAnimation extends Applet implements Runnable {
 int x=0,y=50,dx=5; Thread t;
 public void init(){ setBackground(Color.white); }
 public void start(){ t=new Thread(this); t.start(); }
 public void run(){
  while(true){
   x+=dx;
   if(x>getWidth()-50||x<0) dx=-dx;
   repaint();
   try{ Thread.sleep(50); }catch(InterruptedException e){}
  }
 }
 public void paint(Graphics g){ g.setColor(Color.red); g.fillOval(x,y,50,50); }
}`,
    explanation:
      "Uses a Thread to move a red ball horizontally inside an Applet, reversing direction at the edges.",
    output: `[Graphical output in appletviewer]
A red ball moves left and right across a white applet window.

(Run with appletviewer BallAnimation.html)`,
  },
  {
    id: 10,
    title: "Mouse events and keyboard events",
    shortTitle: "Mouse and keyboard events",
    code: `import java.applet.*;
import java.awt.*;
import java.awt.event.*;

/* <applet code="MouseKeyboardEvents" width=500 height=400></applet> */

public class MouseKeyboardEvents extends Applet
implements MouseListener, MouseMotionListener, KeyListener {
String msg = "";
int x = 10, y = 20;

public void init() {
addMouseListener(this);
addMouseMotionListener(this);
addKeyListener(this);
setBackground(Color.yellow);
setForeground(Color.blue);
// To receive keyboard input focus
requestFocus();
}

public void paint(Graphics g) {
g.drawString(msg, x, y);
}

// ---------------- Mouse Events ----------------
public void mouseClicked(MouseEvent e) {
msg = "Mouse Clicked";
x = e.getX();
y = e.getY();
repaint();
}

public void mousePressed(MouseEvent e) {
msg = "Mouse Pressed";
repaint();
}

public void mouseReleased(MouseEvent e) {
msg = "Mouse Released";
repaint();
}

public void mouseEntered(MouseEvent e) {
msg = "Mouse Entered Applet Area";
repaint();
}

public void mouseExited(MouseEvent e) {
msg = "Mouse Exited Applet Area";
repaint();
}

// Mouse Motion Events
public void mouseMoved(MouseEvent e) {
msg = "Mouse Moved";
x = e.getX();
y = e.getY();
repaint();
}

public void mouseDragged(MouseEvent e) {
msg = "Mouse Dragged";
x = e.getX();
y = e.getY();
repaint();
}

// ---------------- Keyboard Events ----------------
public void keyPressed(KeyEvent e) {
msg = "Key Pressed: " + e.getKeyChar();
repaint();
}

public void keyReleased(KeyEvent e) {
msg = "Key Released: " + e.getKeyChar();
repaint();
}

public void keyTyped(KeyEvent e) {
msg = "Key Typed: " + e.getKeyChar();
repaint();
}
}

/* HTML — MouseKeyboardEvents.html
<html>
<body>
<applet code="MouseKeyboardEvents.class" width="500" height="400">
</applet>
</body>
</html>

Compile & run:
javac MouseKeyboardEvents.java
appletviewer MouseKeyboardEvents.html
*/`,
    shortCode: `import java.applet.*;
import java.awt.*;
import java.awt.event.*;
public class MouseKeyboardEvents extends Applet
 implements MouseListener, MouseMotionListener, KeyListener {
 String msg=""; int x=10,y=20;
 public void init(){
  addMouseListener(this); addMouseMotionListener(this); addKeyListener(this);
  setBackground(Color.yellow); setForeground(Color.blue); requestFocus();
 }
 public void paint(Graphics g){ g.drawString(msg,x,y); }
 public void mouseClicked(MouseEvent e){ msg="Mouse Clicked"; x=e.getX(); y=e.getY(); repaint(); }
 public void mousePressed(MouseEvent e){ msg="Mouse Pressed"; repaint(); }
 public void mouseReleased(MouseEvent e){ msg="Mouse Released"; repaint(); }
 public void mouseEntered(MouseEvent e){ msg="Mouse Entered Applet Area"; repaint(); }
 public void mouseExited(MouseEvent e){ msg="Mouse Exited Applet Area"; repaint(); }
 public void mouseMoved(MouseEvent e){ msg="Mouse Moved"; x=e.getX(); y=e.getY(); repaint(); }
 public void mouseDragged(MouseEvent e){ msg="Mouse Dragged"; x=e.getX(); y=e.getY(); repaint(); }
 public void keyPressed(KeyEvent e){ msg="Key Pressed: "+e.getKeyChar(); repaint(); }
 public void keyReleased(KeyEvent e){ msg="Key Released: "+e.getKeyChar(); repaint(); }
 public void keyTyped(KeyEvent e){ msg="Key Typed: "+e.getKeyChar(); repaint(); }
}`,
    explanation:
      "Applet listens for mouse and keyboard events and draws status messages at the pointer or fixed position.",
    output: `Sample messages shown in applet:
Mouse Entered Applet Area
Mouse Moved
Mouse Clicked
Key Typed: A

(Run with appletviewer MouseKeyboardEvents.html)`,
  },
];
