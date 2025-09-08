import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  BookOpen, 
  Users, 
  Calendar, 
  MapPin, 
  Clock,
  QrCode,
  Edit,
  Trash2
} from "lucide-react";
import { QRCodeGenerator } from "./QRCodeGenerator";

interface Class {
  id: string;
  name: string;
  code: string;
  description: string;
  schedule: string;
  location: string;
  studentsCount: number;
  isActive: boolean;
}

// Mock data
const mockClasses: Class[] = [
  {
    id: "1",
    name: "Computer Science 101",
    code: "CS101",
    description: "Introduction to programming and computer science fundamentals",
    schedule: "Mon, Wed, Fri - 09:00 AM",
    location: "Room A-101, Building A",
    studentsCount: 45,
    isActive: true,
  },
  {
    id: "2", 
    name: "Data Structures",
    code: "CS201",
    description: "Advanced data structures and algorithms",
    schedule: "Tue, Thu - 11:00 AM",
    location: "Lab B-205, Building B",
    studentsCount: 38,
    isActive: true,
  },
  {
    id: "3",
    name: "Web Development",
    code: "WEB301",
    description: "Full-stack web development with modern frameworks",
    schedule: "Mon, Wed - 02:00 PM", 
    location: "Computer Lab C-301",
    studentsCount: 52,
    isActive: false,
  },
];

export const ClassManager = () => {
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newClass, setNewClass] = useState({
    name: "",
    code: "",
    description: "",
    schedule: "",
    location: "",
  });

  const handleCreateClass = () => {
    if (!newClass.name || !newClass.code) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const classData: Class = {
      id: Date.now().toString(),
      ...newClass,
      studentsCount: 0,
      isActive: true,
    };

    setClasses([...classes, classData]);
    setNewClass({ name: "", code: "", description: "", schedule: "", location: "" });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Class created!",
      description: `${newClass.name} has been successfully created.`,
    });
  };

  const handleGenerateQR = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsQRDialogOpen(true);
  };

  const toggleClassStatus = (classId: string) => {
    setClasses(classes.map(cls => 
      cls.id === classId 
        ? { ...cls, isActive: !cls.isActive }
        : cls
    ));
    
    const updatedClass = classes.find(cls => cls.id === classId);
    toast({
      title: updatedClass?.isActive ? "Class deactivated" : "Class activated",
      description: `${updatedClass?.name} status updated successfully.`,
    });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Class Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage your classes</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:shadow-glow transition-spring">
              <Plus className="mr-2 h-4 w-4" />
              Create Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
              <DialogDescription>
                Add a new class to your course catalog
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Class Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Computer Science 101"
                  value={newClass.name}
                  onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Class Code *</Label>
                <Input
                  id="code"
                  placeholder="e.g., CS101"
                  value={newClass.code}
                  onChange={(e) => setNewClass({...newClass, code: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the class"
                  value={newClass.description}
                  onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="schedule">Schedule</Label>
                <Input
                  id="schedule"
                  placeholder="e.g., Mon, Wed, Fri - 09:00 AM"
                  value={newClass.schedule}
                  onChange={(e) => setNewClass({...newClass, schedule: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Room A-101, Building A"
                  value={newClass.location}
                  onChange={(e) => setNewClass({...newClass, location: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateClass}>
                Create Class
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem, index) => (
          <Card 
            key={classItem.id} 
            className={`glass shadow-card hover:shadow-elevated transition-spring animate-slide-up ${
              !classItem.isActive ? 'opacity-60' : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {classItem.code}
                    </Badge>
                  </div>
                </div>
                <Badge variant={classItem.isActive ? "default" : "secondary"}>
                  {classItem.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {classItem.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{classItem.studentsCount} students enrolled</span>
                </div>
                
                {classItem.schedule && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{classItem.schedule}</span>
                  </div>
                )}
                
                {classItem.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{classItem.location}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3">
                <Button
                  size="sm"
                  onClick={() => handleGenerateQR(classItem)}
                  className="flex-1 bg-gradient-primary"
                  disabled={!classItem.isActive}
                >
                  <QrCode className="mr-1 h-3 w-3" />
                  QR Code
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleClassStatus(classItem.id)}
                >
                  {classItem.isActive ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate QR Code</DialogTitle>
            <DialogDescription>
              QR code for {selectedClass?.name} ({selectedClass?.code})
            </DialogDescription>
          </DialogHeader>
          {selectedClass && (
            <QRCodeGenerator 
              classData={selectedClass} 
              onClose={() => setIsQRDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};