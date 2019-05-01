#include <iostream>
#include <list>
#include <string>
using namespace std;

class Living
{
    public:
    void setHealth(int health) {
        this->health = health;
    }
    int getHealth() 
    {
        return health;
    }
    private:
    int health;
}

class Job 
{
    virtual void executeJob();
    string title;
    void setTitle(string title) {
        this->title = title;
    }
}

class Astronaut: public Job
{
    executeJob(string destination) {
        this->location = destination;
    }
    Astronaut() { setTitle("Astronaut"); }
    private:
    string location;
}

class Person: public Living
{
    public:
    void setJob(Job job) {
        this->job = job;
    }
    Job getJob() {
        return job;
    }
    private:
    Job job;
}

class Game 
{
    list<Job> jobs;
    list<Person> persons;
}

int main() {
  //start game
  Game game = new Game()
  game.persons = 
  game.jobs = 


    return 0;
}