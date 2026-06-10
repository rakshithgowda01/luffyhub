import { Program } from "./types";

export const SHORT_CODE_MAP: Record<number, string> = {
  1: `#include <stdio.h>
int gcd(int a, int b) {
 if (b == 0) return a;
 return gcd(b, a % b);
}
int main() {
 int a, b;
 scanf("%d %d", &a, &b);
 printf("GCD of %d and %d is %d\\n", a, b, gcd(a, b));
}`,
  2: `#include <stdio.h>
int fact(int n) { int f=1,i; for(i=1;i<=n;i++) f*=i; return f; }
int nCr(int n,int r) { return fact(n)/(fact(r)*fact(n-r)); }
int main() {
 int n,i,j; scanf("%d",&n);
 for(i=0;i<n;i++){ for(j=0;j<=i;j++) printf("%d ",nCr(i,j)); printf("\\n"); }
}`,
  3: `#include <stdio.h>
int fib(int n) {
 if(n<=1) return n;
 return fib(n-1)+fib(n-2);
}
int main() {
 int n,i; scanf("%d",&n);
 for(i=0;i<n;i++) printf("%d ",fib(i));
}`,
  4: `#include <stdio.h>
void hanoi(int n,char f,char t,char a){
 if(n==1){ printf("Move disk 1 from %c to %c\\n",f,t); return; }
 hanoi(n-1,f,a,t);
 printf("Move disk %d from %c to %c\\n",n,f,t);
 hanoi(n-1,a,t,f);
}
int main(){ int n; scanf("%d",&n); hanoi(n,'A','C','B'); }`,
  5: `#include <stdio.h>
#include <stdlib.h>
int main() {
 int n,*a,i; scanf("%d",&n);
 a=malloc(n*sizeof(int));
 for(i=0;i<n;i++) scanf("%d",&a[i]);
 int min=a[0],max=a[0];
 for(i=1;i<n;i++){ if(a[i]<min)min=a[i]; if(a[i]>max)max=a[i]; }
 printf("Smallest = %d\\nLargest = %d\\n",min,max);
 free(a);
}`,
  6: `#include <stdio.h>
int main() {
 FILE *e=fopen("even.txt","w"),*o=fopen("odd.txt","w");
 int n,x,i; scanf("%d",&n);
 for(i=0;i<n;i++){ scanf("%d",&x); (x%2)?fprintf(o,"%d\\n",x):fprintf(e,"%d\\n",x); }
 fclose(e); fclose(o);
 printf("Numbers stored in even.txt and odd.txt");
}`,
  7: `#include <stdio.h>
struct Student{ int roll; char name[50]; float marks; };
int main() {
 FILE *fp=fopen("students.txt","w");
 struct Student s; int n,i;
 scanf("%d",&n);
 for(i=0;i<n;i++){
  scanf("%d %s %f",&s.roll,s.name,&s.marks);
  fprintf(fp,"%d %s %.2f\\n",s.roll,s.name,s.marks);
 }
 fclose(fp);
 printf("Student records stored in students.txt");
}`,
  8: `#include <stdio.h>
#include <string.h>
int main() {
 char c[50][50],t[50]; int n,i,j;
 scanf("%d",&n);
 for(i=0;i<n;i++) scanf("%s",c[i]);
 for(i=0;i<n-1;i++) for(j=i+1;j<n;j++)
  if(strcmp(c[i],c[j])>0){ strcpy(t,c[i]); strcpy(c[i],c[j]); strcpy(c[j],t); }
 printf("Cities in alphabetical order:\\n");
 for(i=0;i<n;i++) printf("%s\\n",c[i]);
}`,
  9: `#include <stdio.h>
void sel(int a[],int n){
 int i,j,min,t;
 for(i=0;i<n-1;i++){ min=i;
  for(j=i+1;j<n;j++) if(a[j]<a[min]) min=j;
  if(min!=i){ t=a[i]; a[i]=a[min]; a[min]=t; }
 }}
int main(){
 int a[20],n,i; scanf("%d",&n);
 for(i=0;i<n;i++) scanf("%d",&a[i]);
 sel(a,n);
 printf("Sorted elements are:\\n");
 for(i=0;i<n;i++) printf("%d ",a[i]);
}`,
  10: `#include <stdio.h>
void bubble(int a[],int n){
 int i,j,t;
 for(i=0;i<n-1;i++) for(j=0;j<n-i-1;j++)
  if(a[j]>a[j+1]){ t=a[j]; a[j]=a[j+1]; a[j+1]=t; }
}
int main(){
 int a[100],n,i; scanf("%d",&n);
 for(i=0;i<n;i++) scanf("%d",&a[i]);
 bubble(a,n);
 printf("Sorted array:\\n");
 for(i=0;i<n;i++) printf("%d ",a[i]);
}`,
  11: `#include <stdio.h>
void ins(int A[],int n){
 int i,j,k;
 for(i=1;i<n;i++){ k=A[i]; j=i-1;
  while(j>=0&&A[j]>k){ A[j+1]=A[j]; j--; }
  A[j+1]=k;
 }}
int main(){
 int A[100],n,i; scanf("%d",&n);
 for(i=0;i<n;i++) scanf("%d",&A[i]);
 ins(A,n);
 printf("Sorted array:\\n");
 for(i=0;i<n;i++) printf("%d ",A[i]);
}`,
  12: `#include <stdio.h>
int part(int a[],int l,int h){
 int p=a[h],i=l-1,j,t;
 for(j=l;j<h;j++) if(a[j]<p){ i++; t=a[i]; a[i]=a[j]; a[j]=t; }
 t=a[i+1]; a[i+1]=a[h]; a[h]=t; return i+1;
}
void quick(int a[],int l,int h){
 if(l<h){ int pi=part(a,l,h); quick(a,l,pi-1); quick(a,pi+1,h); }
}
int main(){
 int a[100],n,i; scanf("%d",&n);
 for(i=0;i<n;i++) scanf("%d",&a[i]);
 quick(a,0,n-1);
 printf("Sorted array:\\n");
 for(i=0;i<n;i++) printf("%d ",a[i]);
}`,
  13: `#include <stdio.h>
void merge(int a[],int l,int m,int r){
 int i=l,j=m+1,k=0,t[100];
 while(i<=m&&j<=r) t[k++]=(a[i]<=a[j])?a[i++]:a[j++];
 while(i<=m) t[k++]=a[i++];
 while(j<=r) t[k++]=a[j++];
 for(i=l,k=0;i<=r;i++,k++) a[i]=t[k];
}
void ms(int a[],int l,int r){
 if(l<r){ int m=(l+r)/2; ms(a,l,m); ms(a,m+1,r); merge(a,l,m,r); }
}
int main(){
 int a[100],n,i; scanf("%d",&n);
 for(i=0;i<n;i++) scanf("%d",&a[i]);
 ms(a,0,n-1);
 printf("Sorted array:\\n");
 for(i=0;i<n;i++) printf("%d ",a[i]);
}`,
  14: `#include <stdio.h>
int main(){
 int n,a[10],k,i,found=0;
 scanf("%d",&n);
 for(i=0;i<n;i++) scanf("%d",&a[i]);
 scanf("%d",&k);
 for(i=0;i<n;i++) if(a[i]==k){ printf("Element found at position %d",i+1); found=1; break; }
 if(!found) printf("Element not found");
}`,
  15: `#include <stdio.h>
int bs(int a[],int l,int h,int k){
 if(l>h) return -1;
 int m=(l+h)/2;
 if(a[m]==k) return m;
 if(a[m]>k) return bs(a,l,m-1,k);
 return bs(a,m+1,h,k);
}
int main(){
 int n,a[10],k,i,r; scanf("%d",&n);
 for(i=0;i<n;i++) scanf("%d",&a[i]);
 scanf("%d",&k);
 r=bs(a,0,n-1,k);
 if(r!=-1) printf("Element found at position %d",r+1);
 else printf("Element not found");
}`,
  16: `#include <stdio.h>
#define SIZE 5
int s[SIZE],top=-1;
void push(int v){ if(top<SIZE-1) s[++top]=v; else printf("Stack Overflow\\n"); }
void pop(){ if(top>=0) printf("Popped element: %d\\n",s[top--]); else printf("Stack Underflow\\n"); }
int main(){
 int ch,v;
 do{
  scanf("%d",&ch);
  if(ch==1){ scanf("%d",&v); push(v); printf("%d pushed into stack\\n",v); }
  else if(ch==2) pop();
 }while(ch!=4);
}`,
  17: `#include <stdio.h>
#include <ctype.h>
char st[100]; int top=-1;
void push(char c){st[++top]=c;} char pop(){return st[top--];}
int prec(char c){ return (c=='+'||c=='-')?1:(c=='*'||c=='/')?2:0; }
int main(){
 char in[100],post[100]; int i,k=0;
 scanf("%s",in);
 for(i=0;in[i];i++){
  if(isalnum(in[i])) post[k++]=in[i];
  else{ while(top>=0&&prec(st[top])>=prec(in[i])) post[k++]=pop(); push(in[i]); }
 }
 while(top>=0) post[k++]=pop();
 post[k]=0; printf("Postfix expression: %s",post);
}`,
  18: `#include <stdio.h>
#define SIZE 5
int q[SIZE],f=-1,r=-1;
void enq(int v){
 if(r<SIZE-1){ if(f==-1)f=0; q[++r]=v; printf("%d inserted into queue\\n",v); }
 else printf("Queue Overflow\\n");
}
void deq(){
 if(f<=r&&f!=-1) printf("Deleted element: %d\\n",q[f++]);
 else printf("Queue Underflow\\n");
}
int main(){
 int ch,v;
 do{ scanf("%d",&ch);
  if(ch==1){ scanf("%d",&v); enq(v); }
  else if(ch==2) deq();
 }while(ch!=4);
}`,
  19: `#include <stdio.h>
#include <stdlib.h>
struct Node{ int data; struct Node *next; };
int main(){
 struct Node *head=NULL,*t,*n; int x,i,nodes;
 scanf("%d",&nodes);
 for(i=0;i<nodes;i++){
  scanf("%d",&x);
  n=malloc(sizeof(struct Node));
  n->data=x; n->next=NULL;
  if(!head) head=t=n; else{ t->next=n; t=n; }
 }
 printf("Linked List:\\n");
 for(t=head;t;t=t->next) printf("%d ",t->data);
}`,
  20: `#include <stdio.h>
#include <stdlib.h>
struct Node{ int data; struct Node *l,*r; };
struct Node* newN(int d){ struct Node*n=malloc(sizeof(struct Node)); n->data=d; n->l=n->r=NULL; return n; }
void inorder(struct Node* r){
 if(r){ inorder(r->l); printf("%d ",r->data); inorder(r->r); }
}
int main(){
 struct Node* root=newN(1);
 root->l=newN(2); root->r=newN(3);
 printf("Inorder Traversal: "); inorder(root);
}`,
};

export function applyShortCodes(programs: Program[]): Program[] {
  return programs.map((p) => ({
    ...p,
    shortCode: SHORT_CODE_MAP[p.id] ?? p.shortCode ?? "",
  }));
}
