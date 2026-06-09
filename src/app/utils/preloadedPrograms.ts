import { Program } from "./types";

export const preloadedPrograms: Program[] = [
  {
    id: 1,
    title: "Program to find GCD using recursive function.",
    shortTitle: "GCD using Recursive Function",
    code: `#include <stdio.h>
// Recursive function to find GCD
int gcd(int a, int b) {
 if (b == 0)
 return a;
 else
 return gcd(b, a % b);
}
int main() {
 int num1, num2, result;
 printf("Enter two numbers: ");
 scanf("%d %d", &num1, &num2);
 result = gcd(num1, num2);
 printf("GCD of %d and %d is %d\\n", num1, num2, result);
 return 0;
}`,
    explanation:
      "Uses Euclid's algorithm recursively. When b is 0, a is the GCD; otherwise gcd(b, a % b) is called until the remainder becomes zero.",
    output: `Enter two numbers: 48 18
GCD of 48 and 18 is 6`,
  },
  {
    id: 2,
    title: "Program to display Pascal Triangle using binomial function",
    shortTitle: "Pascal Triangle using Binomial Function",
    code: `#include <stdio.h>
// Function to calculate factorial
int factorial(int n)
{
 int i, fact = 1;
 for(i = 1; i <= n; i++)
 {
 fact = fact * i;
 }
 return fact;
}
// Function to calculate nCr (Binomial Coefficient)
int nCr(int n, int r)
{
 return factorial(n) / (factorial(r) * factorial(n - r));
}
int main()
{
 int n, i, j;
 printf("Enter number of rows: ");
 scanf("%d", &n);
 for(i = 0; i < n; i++)
 {
 for(j = 0; j <= i; j++)
 {
 printf("%d ", nCr(i, j));
 }
 printf("\\n");
 }
 return 0;
}`,
    explanation:
      "Calculates factorial iteratively and uses nCr to print each row of Pascal's triangle. Each row i contains binomial coefficients C(i, j) for j from 0 to i.",
    output: `Enter number of rows: 5
1
1 1
1 2 1
1 3 3 1
1 4 6 4 1`,
  },
  {
    id: 3,
    title: "Program to generate n Fibonacci numbers using recursive function.",
    shortTitle: "Fibonacci Numbers using Recursive Function",
    code: `#include <stdio.h>
int fibonacci(int n) {
 if (n == 0)
 return 0;
 else if (n == 1)
 return 1;
 else
 return fibonacci(n-1) + fibonacci(n-2);
}
int main() {
 int n;
 printf("Enter number of terms: ");
 scanf("%d", &n);
 for(int i = 0; i < n; i++) {
 printf("%d ", fibonacci(i));
 }
 return 0;
}`,
    explanation:
      "Generates Fibonacci numbers recursively. Base cases: fib(0)=0 and fib(1)=1. Each term is the sum of the two preceding recursive calls.",
    output: `Enter number of terms: 8
0 1 1 2 3 5 8 13`,
  },
  {
    id: 4,
    title: "Program to implement Towers of Hanoi.",
    shortTitle: "Towers of Hanoi",
    code: `#include <stdio.h>
void towerOfHanoi(int n, char from, char to, char aux) {
 if (n == 1) {
 printf("Move disk 1 from %c to %c\\n", from, to);
 return;
 }
 towerOfHanoi(n-1, from, aux, to);
 printf("Move disk %d from %c to %c\\n", n, from, to);
 towerOfHanoi(n-1, aux, to, from);
}
int main() {
 int n;
 printf("Enter number of disks: ");
 scanf("%d", &n);
 towerOfHanoi(n, 'A', 'C', 'B');
 return 0;
}`,
    explanation:
      "Recursive Tower of Hanoi solution. Move n-1 disks to auxiliary peg, move the largest disk to destination, then move n-1 disks from auxiliary to destination.",
    output: `Enter number of disks: 3
Move disk 1 from A to C
Move disk 2 from A to B
Move disk 1 from C to B
Move disk 3 from A to C
Move disk 1 from B to A
Move disk 2 from B to C
Move disk 1 from A to C`,
  },
  {
    id: 5,
    title: "Program to implement dynamic array, find smallest and largest element of the array.",
    shortTitle: "Dynamic Array — Smallest and Largest Element",
    code: `#include <stdio.h>
#include <stdlib.h>
int main() {
 int n, *arr, i;
 printf("Enter number of elements: ");
 scanf("%d", &n);
 arr = (int*)malloc(n * sizeof(int));
 printf("Enter elements:\\n");
 for(i = 0; i < n; i++)
 scanf("%d", &arr[i]);
 int smallest = arr[0], largest = arr[0];
 for(i = 1; i < n; i++) {
 if(arr[i] < smallest)
 smallest = arr[i];
 if(arr[i] > largest)
 largest = arr[i];
 }
 printf("Smallest = %d\\n", smallest);
 printf("Largest = %d\\n", largest);
 free(arr);
 return 0;
}`,
    explanation:
      "Dynamically allocates an array with malloc, reads elements, scans to find smallest and largest values, then frees the allocated memory.",
    output: `Enter number of elements: 5
Enter elements:
34 12 89 5 67
Smallest = 5
Largest = 89`,
  },
  {
    id: 6,
    title: "Program to create two files to store even and odd numbers.",
    shortTitle: "Create Files to Store Even and Odd Numbers",
    code: `#include <stdio.h>
int main() {
 FILE *evenFile, *oddFile;
 int n, num;
 evenFile = fopen("even.txt", "w");
 oddFile = fopen("odd.txt", "w");
 printf("How many numbers? ");
 scanf("%d", &n);
 for(int i = 0; i < n; i++) {
 scanf("%d", &num);
 if(num % 2 == 0)
 fprintf(evenFile, "%d\\n", num);
 else
 fprintf(oddFile, "%d\\n", num);
 }
 fclose(evenFile);
 fclose(oddFile);
 printf("Numbers stored in even.txt and odd.txt");
 return 0;
}`,
    explanation:
      "Opens two files and writes each input number to even.txt or odd.txt based on whether it is divisible by 2.",
    output: `How many numbers? 6
1 2 3 4 5 6
Numbers stored in even.txt and odd.txt`,
  },
  {
    id: 7,
    title: "Program to create a file to store student records.",
    shortTitle: "Create File to Store Student Records",
    code: `#include <stdio.h>
struct Student {
 int roll;
 char name[50];
 float marks;
};
int main() {
 FILE *fp;
 struct Student s;
 int n;
 fp = fopen("students.txt", "w");
 printf("Enter number of students: ");
 scanf("%d", &n);
 for(int i = 0; i < n; i++) {
 printf("Enter Roll, Name, Marks: ");
 scanf("%d %s %f", &s.roll, s.name, &s.marks);
 fprintf(fp, "%d %s %.2f\\n", s.roll, s.name, s.marks);
 }
 fclose(fp);
 printf("Student records stored in students.txt");
 return 0;
}`,
    explanation:
      "Defines a Student struct and writes roll number, name, and marks for each student to students.txt using formatted file output.",
    output: `Enter number of students: 2
Enter Roll, Name, Marks: 101 Alice 88.50
Enter Roll, Name, Marks: 102 Bob 76.00
Student records stored in students.txt`,
  },
  {
    id: 8,
    title: "Program to read the names of cities and arrange them alphabetically.",
    shortTitle: "Sort City Names Alphabetically",
    code: `#include <stdio.h>
#include <string.h>
int main() {
 int n;
 char cities[50][50], temp[50];
 printf("Enter number of cities: ");
 scanf("%d", &n);
 printf("Enter city names:\\n");
 for(int i = 0; i < n; i++)
 scanf("%s", cities[i]);
 for(int i = 0; i < n-1; i++) {
 for(int j = i+1; j < n; j++) {
 if(strcmp(cities[i], cities[j]) > 0) {
 strcpy(temp, cities[i]);
 strcpy(cities[i], cities[j]);
 strcpy(cities[j], temp);
 }
 }
 }
 printf("Cities in alphabetical order:\\n");
 for(int i = 0; i < n; i++)
 printf("%s\\n", cities[i]);
 return 0;
}`,
    explanation:
      "Reads city names into a 2D char array and sorts them alphabetically using bubble sort with strcmp for comparison.",
    output: `Enter number of cities: 5
Enter city names:
Delhi
Mumbai
Chennai
Bangalore
Ahmedabad
Cities in alphabetical order:
Ahmedabad
Bangalore
Chennai
Delhi
Mumbai`,
  },
  {
    id: 9,
    title: "Program to sort the given list using selection sort technique.",
    shortTitle: "Selection Sort",
    code: `#include <stdio.h>
void selection_sort(int a[], int n)
{
 int i, j, min, temp;
 for(i = 0; i < n-1; i++)
 {
 min = i;
 for(j = i+1; j < n; j++)
 {
 if(a[j] < a[min])
 min = j;
 }
 if(min != i)
 {
 temp = a[i];
 a[i] = a[min];
 a[min] = temp;
 }
 }
}
int main()
{
 int a[20], n, i;
 printf("Enter number of elements: ");
 scanf("%d", &n);
 printf("Enter elements:\\n");
 for(i = 0; i < n; i++)
 scanf("%d", &a[i]);
 selection_sort(a, n);
 printf("Sorted elements are:\\n");
 for(i = 0; i < n; i++)
 printf("%d ", a[i]);
 return 0;
}`,
    explanation:
      "Selection sort finds the minimum element in the unsorted portion and swaps it to the current position, repeating until the array is sorted.",
    output: `Enter number of elements: 5
Enter elements:
64 25 12 22 11
Sorted elements are:
11 12 22 25 64`,
  },
  {
    id: 10,
    title: "Program to sort the given list using bubble sort technique.",
    shortTitle: "Bubble Sort",
    code: `#include <stdio.h>
// Separate function for Bubble Sort
void bubbleSort(int arr[], int n) {
 int i, j, temp;
 for(i = 0; i < n-1; i++) {
 for(j = 0; j < n-i-1; j++) {
 if(arr[j] > arr[j+1]) {
 temp = arr[j];
 arr[j] = arr[j+1];
 arr[j+1] = temp;
 }
 }
 }
}
int main() {
 int n, arr[100], i;
 printf("Enter number of elements: ");
 scanf("%d", &n);
 printf("Enter elements:\\n");
 for(i = 0; i < n; i++)
 scanf("%d", &arr[i]);
 // Function call
 bubbleSort(arr, n);
 printf("Sorted array:\\n");
 for(i = 0; i < n; i++)
 printf("%d ", arr[i]);
 return 0;
}`,
    explanation:
      "Bubble sort repeatedly compares adjacent elements and swaps them if they are in wrong order, pushing larger values toward the end each pass.",
    output: `Enter number of elements: 5
Enter elements:
5 1 4 2 8
Sorted array:
1 2 4 5 8`,
  },
  {
    id: 11,
    title: "Program to sort the given list using insertion sort technique.",
    shortTitle: "Insertion Sort",
    code: `#include <stdio.h>
void insertionSort(int A[], int n)
{
 int i, j, key;
 for(i = 1; i < n; i++)
 {
 key = A[i];
 j = i - 1;
 while(j >= 0 && A[j] > key)
 {
 A[j + 1] = A[j];
 j = j - 1;
 }
 A[j + 1] = key;
 }
}
int main()
{
 int A[100], n, i;
 printf("Enter number of elements: ");
 scanf("%d", &n);
 printf("Enter elements:\\n");
 for(i = 0; i < n; i++)
 scanf("%d", &A[i]);
 insertionSort(A, n);
 printf("Sorted array:\\n");
 for(i = 0; i < n; i++)
 printf("%d ", A[i]);
 return 0;
}`,
    explanation:
      "Insertion sort builds a sorted portion by shifting elements greater than the key one position right, then inserting the key in its correct place.",
    output: `Enter number of elements: 5
Enter elements:
12 11 13 5 6
Sorted array:
5 6 11 12 13`,
  },
  {
    id: 12,
    title: "Program to sort the given list using quick sort technique.",
    shortTitle: "Quick Sort",
    code: `#include <stdio.h>
void quickSort(int arr[], int low, int high);
int partition(int arr[], int low, int high);
int main() {
 int n, arr[100], i;
 printf("Enter number of elements: ");
 scanf("%d", &n);
 printf("Enter elements:\\n");
 for(i = 0; i < n; i++)
 scanf("%d", &arr[i]);
 quickSort(arr, 0, n-1);
 printf("Sorted array:\\n");
 for(i = 0; i < n; i++)
 printf("%d ", arr[i]);
 return 0;
}
void quickSort(int arr[], int low, int high) {
 if(low < high) {
 int pi = partition(arr, low, high);
 quickSort(arr, low, pi-1);
 quickSort(arr, pi+1, high);
 }
}
int partition(int arr[], int low, int high) {
 int pivot = arr[high];
 int i = low - 1, temp;
 for(int j = low; j < high; j++) {
 if(arr[j] < pivot) {
 i++;
 temp = arr[i];
 arr[i] = arr[j];
 arr[j] = temp;
 }
 }
 temp = arr[i+1];
 arr[i+1] = arr[high];
 arr[high] = temp;
 return i+1;
}`,
    explanation:
      "Quick sort picks a pivot, partitions the array so smaller elements are left and larger are right, then recursively sorts both partitions.",
    output: `Enter number of elements: 6
Enter elements:
10 7 8 9 1 5
Sorted array:
1 5 7 8 9 10`,
  },
  {
    id: 13,
    title: "Program to sort the given list using merge sort technique.",
    shortTitle: "Merge Sort",
    code: `#include <stdio.h>
void merge(int arr[], int l, int m, int r) {
 int i = l, j = m+1, k = 0, temp[100];
 while(i <= m && j <= r) {
 if(arr[i] <= arr[j])
 temp[k++] = arr[i++];
 else
 temp[k++] = arr[j++];
 }
 while(i <= m)
 temp[k++] = arr[i++];
 while(j <= r)
 temp[k++] = arr[j++];
 for(i = l, k = 0; i <= r; i++, k++)
 arr[i] = temp[k];
}
void mergeSort(int arr[], int l, int r) {
 if(l < r) {
 int m = (l + r) / 2;
 mergeSort(arr, l, m);
 mergeSort(arr, m+1, r);
 merge(arr, l, m, r);
 }
}
int main() {
 int n, arr[100], i;
 printf("Enter number of elements: ");
 scanf("%d", &n);
 for(i = 0; i < n; i++)
 scanf("%d", &arr[i]);
 mergeSort(arr, 0, n-1);
 printf("Sorted array:\\n");
 for(i = 0; i < n; i++)
 printf("%d ", arr[i]);
 return 0;
}`,
    explanation:
      "Merge sort divides the array in half recursively, sorts each half, then merges them back together using a temporary buffer.",
    output: `Enter number of elements: 7
5 3 8 1 9 2 7
Sorted array:
1 2 3 5 7 8 9`,
  },
  {
    id: 14,
    title: "Program to search an element using linear search technique.",
    shortTitle: "Linear Search",
    code: `#include <stdio.h>
int main() {
 int n, arr[10], key, i, found = 0;
 printf("Enter number of elements: ");
 scanf("%d", &n);
 for(i = 0; i < n; i++)
 scanf("%d", &arr[i]);
 printf("Enter element to search: ");
 scanf("%d", &key);
 for(i = 0; i < n; i++) {
 if(arr[i] == key) {
 printf("Element found at position %d", i+1);
 found = 1;
 break;
 }
 }
 if(!found)
 printf("Element not found");
 return 0;
}`,
    explanation:
      "Linear search scans the array sequentially from the first element until the key is found or the end is reached.",
    output: `Enter number of elements: 5
10 20 30 40 50
Enter element to search: 30
Element found at position 3`,
  },
  {
    id: 15,
    title: "Program to search an element using recursive binary search technique.",
    shortTitle: "Recursive Binary Search",
    code: `#include <stdio.h>
int binarySearch(int arr[], int low, int high, int key) {
 if(low > high)
 return -1;
 int mid = (low + high) / 2;
 if(arr[mid] == key)
 return mid;
 else if(arr[mid] > key)
 return binarySearch(arr, low, mid-1, key);
 else
 return binarySearch(arr, mid+1, high, key);
}
int main() {
 int n, arr[10], key, i, result;
 printf("Enter number of elements: ");
 scanf("%d", &n);
 printf("Enter sorted elements:\\n");
 for(i = 0; i < n; i++)
 scanf("%d", &arr[i]);
 printf("Enter element to search: ");
 scanf("%d", &key);
 result = binarySearch(arr, 0, n-1, key);
 if(result != -1)
 printf("Element found at position %d", result+1);
 else
 printf("Element not found");
 return 0;
}`,
    explanation:
      "Binary search works on a sorted array. It compares the key with the middle element and recursively searches the left or right half.",
    output: `Enter number of elements: 8
Enter sorted elements:
2 5 8 12 16 23 38 45
Enter element to search: 23
Element found at position 6`,
  },
  {
    id: 16,
    title: "Program to implement Stack.",
    shortTitle: "Stack Implementation",
    code: `#include <stdio.h>
#define SIZE 5
int stack[SIZE];
int top = -1;
// Push operation
void push() {
 int value;
 if (top == SIZE - 1) {
 printf("Stack Overflow\\n");
 } else {
 printf("Enter value to push: ");
 scanf("%d", &value);
 stack[++top] = value;
 printf("%d pushed into stack\\n", value);
 }
}
// Pop operation
void pop() {
 if (top == -1) {
 printf("Stack Underflow\\n");
 } else {
 printf("Popped element: %d\\n", stack[top--]);
 }
}
// Display operation
void display() {
 if (top == -1) {
 printf("Stack is empty\\n");
 } else {
 printf("Stack elements:\\n");
 for (int i = top; i >= 0; i--) {
 printf("%d\\n", stack[i]);
 }
 }
}
int main() {
 int choice;
 do {
 printf("\\n--- Stack Operations ---\\n");
 printf("1. Push\\n");
 printf("2. Pop\\n");
 printf("3. Display\\n");
 printf("4. Exit\\n");
 printf("Enter your choice: ");
 scanf("%d", &choice);
 switch (choice) {
 case 1: push(); break;
 case 2: pop(); break;
 case 3: display(); break;
 case 4: printf("Exiting...\\n"); break;
 default: printf("Invalid choice\\n");
 }
 } while (choice != 4);
 return 0;
}`,
    explanation:
      "Array-based stack with push, pop, and display operations using a menu-driven interface. Follows LIFO (Last In, First Out) order.",
    output: `--- Stack Operations ---
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 1
Enter value to push: 10
10 pushed into stack`,
  },
  {
    id: 17,
    title: "Program to convert an infix expression to postfix.",
    shortTitle: "Infix to Postfix Conversion",
    code: `#include <stdio.h>
#include <ctype.h>
#define SIZE 100
char stack[SIZE];
int top = -1;
void push(char x) { stack[++top] = x; }
char pop() { return stack[top--]; }
int precedence(char x) {
 if(x == '+' || x == '-') return 1;
 if(x == '*' || x == '/') return 2;
 return 0;
}
int main() {
 char infix[SIZE], postfix[SIZE];
 int i, k = 0;
 printf("Enter infix expression: ");
 scanf("%s", infix);
 for(i = 0; infix[i] != '\\0'; i++) {
 if(isalnum(infix[i]))
 postfix[k++] = infix[i];
 else {
 while(top != -1 && precedence(stack[top]) >= precedence(infix[i]))
 postfix[k++] = pop();
 push(infix[i]);
 }
 }
 while(top != -1)
 postfix[k++] = pop();
 postfix[k] = '\\0';
 printf("Postfix expression: %s", postfix);
 return 0;
}`,
    explanation:
      "Converts an infix expression to postfix using an operator stack. Operands go directly to output; operators are pushed and popped based on precedence.",
    output: `Enter infix expression: A+B*C
Postfix expression: ABC*+`,
  },
  {
    id: 18,
    title: "Program to implement simple queue.",
    shortTitle: "Simple Queue",
    code: `#include <stdio.h>
#define SIZE 5
int queue[SIZE];
int front = -1, rear = -1;
// Enqueue operation
void enqueue() {
 int value;
 if (rear == SIZE - 1) {
 printf("Queue Overflow\\n");
 } else {
 printf("Enter value to enqueue: ");
 scanf("%d", &value);
 if (front == -1)
 front = 0;
 queue[++rear] = value;
 printf("%d inserted into queue\\n", value);
 }
}
// Dequeue operation
void dequeue() {
 if (front == -1 || front > rear) {
 printf("Queue Underflow\\n");
 } else {
 printf("Deleted element: %d\\n", queue[front++]);
 }
}
// Display operation
void display() {
 if (front == -1 || front > rear) {
 printf("Queue is empty\\n");
 } else {
 printf("Queue elements:\\n");
 for (int i = front; i <= rear; i++) {
 printf("%d ", queue[i]);
 }
 printf("\\n");
 }
}
int main() {
 int choice;
 do {
 printf("\\n--- Queue Menu ---\\n");
 printf("1. Enqueue\\n");
 printf("2. Dequeue\\n");
 printf("3. Display\\n");
 printf("4. Exit\\n");
 printf("Enter your choice: ");
 scanf("%d", &choice);
 switch (choice) {
 case 1: enqueue(); break;
 case 2: dequeue(); break;
 case 3: display(); break;
 case 4: printf("Exiting...\\n"); break;
 default: printf("Invalid choice\\n");
 }
 } while (choice != 4);
 return 0;
}`,
    explanation:
      "Array-based queue with enqueue, dequeue, and display operations using a menu-driven interface. Follows FIFO (First In, First Out) order.",
    output: `--- Queue Menu ---
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 1
Enter value to enqueue: 10
10 inserted into queue`,
  },
  {
    id: 19,
    title: "Program to implement linear linked list.",
    shortTitle: "Linear Linked List",
    code: `#include <stdio.h>
#include <stdlib.h>
struct Node {
 int data;
 struct Node *next;
};
int main() {
 struct Node *head = NULL, *temp, *newNode;
 int n, value;
 printf("Enter number of nodes: ");
 scanf("%d", &n);
 for(int i = 0; i < n; i++) {
 newNode = (struct Node*)malloc(sizeof(struct Node));
 scanf("%d", &value);
 newNode->data = value;
 newNode->next = NULL;
 if(head == NULL)
 head = temp = newNode;
 else {
 temp->next = newNode;
 temp = newNode;
 }
 }
 printf("Linked List:\\n");
 temp = head;
 while(temp != NULL) {
 printf("%d ", temp->data);
 temp = temp->next;
 }
 return 0;
}`,
    explanation:
      "Creates a singly linked list by inserting nodes at the end. Each node stores data and a pointer to the next node, then traverses to print all values.",
    output: `Enter number of nodes: 4
10 20 30 40
Linked List:
10 20 30 40`,
  },
  {
    id: 20,
    title: "Program to display traversal of a tree.",
    shortTitle: "Binary Tree Inorder Traversal",
    code: `#include <stdio.h>
#include <stdlib.h>
struct Node {
 int data;
 struct Node *left, *right;
};
struct Node* createNode(int data) {
 struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
 newNode->data = data;
 newNode->left = newNode->right = NULL;
 return newNode;
}
void inorder(struct Node* root) {
 if(root != NULL) {
 inorder(root->left);
 printf("%d ", root->data);
 inorder(root->right);
 }
}
int main() {
 struct Node* root = createNode(1);
 root->left = createNode(2);
 root->right = createNode(3);
 printf("Inorder Traversal: ");
 inorder(root);
 return 0;
}`,
    explanation:
      "Builds a binary tree with three nodes and performs inorder traversal (left, root, right), printing each visited node's data.",
    output: `Inorder Traversal: 2 1 3`,
  },
];
