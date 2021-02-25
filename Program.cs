using System;

namespace RecordTest
{
    public record Person
    {
        public int ID { get; }
        public string Name { get; }

        public Person(int id, string name)
        {
            ID = id;
            Name = name;
        }
    }
    class Program
    {
        static void Main(string[] args)
        {
            var person1 = new Person(1, "Rob");
            Console.WriteLine(person1);
            
        }
    }
}
