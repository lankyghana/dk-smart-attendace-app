import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  GraduationCap,
  Shield,
  MoreHorizontal,
  CheckCircle,
  XCircle
} from "lucide-react";

// Mock teacher data
const initialTeachers: Teacher[] = [
  {
    id: "T001",
    name: "Dr. Sarah Wilson",
    email: "sarah.wilson@university.edu",
    phone: "+1 (555) 123-4567",
    department: "Computer Science",
    subjects: ["Data Structures", "Algorithms", "Web Development"],
    status: "active" as const,
    dateJoined: "2023-08-15",
    classesAssigned: 3,
    studentsCount: 120
  },
  {
    id: "T002", 
    name: "Prof. Michael Johnson",
    email: "mike.johnson@university.edu",
    phone: "+1 (555) 987-6543",
    department: "Mathematics",
    subjects: ["Calculus", "Linear Algebra", "Statistics"],
    status: "active" as const,
    dateJoined: "2022-09-01",
    classesAssigned: 4,
    studentsCount: 95
  },
  {
    id: "T003",
    name: "Dr. Emily Chen",
    email: "emily.chen@university.edu", 
    phone: "+1 (555) 456-7890",
    department: "Physics",
    subjects: ["Quantum Physics", "Thermodynamics"],
    status: "pending" as const,
    dateJoined: "2025-09-01",
    classesAssigned: 0,
    studentsCount: 0
  }
];

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  subjects: string[];
  status: "active" | "pending" | "suspended";
  dateJoined: string;
  classesAssigned: number;
  studentsCount: number;
}

export const TeacherManagement = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    subjects: ""
  });
  const { toast } = useToast();

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const teacher: Teacher = {
      id: `T${String(teachers.length + 1).padStart(3, '0')}`,
      name: newTeacher.name,
      email: newTeacher.email,
      phone: newTeacher.phone,
      department: newTeacher.department,
      subjects: newTeacher.subjects.split(",").map(s => s.trim()).filter(s => s),
      status: "pending",
      dateJoined: new Date().toISOString().split('T')[0],
      classesAssigned: 0,
      studentsCount: 0
    };

    setTeachers([...teachers, teacher]);
    setNewTeacher({ name: "", email: "", phone: "", department: "", subjects: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Teacher Added",
      description: `${teacher.name} has been registered and will receive login credentials via email.`
    });
  };

  const handleStatusChange = (teacherId: string, newStatus: "active" | "pending" | "suspended") => {
    setTeachers(teachers.map(teacher => 
      teacher.id === teacherId ? { ...teacher, status: newStatus } : teacher
    ));
    
    const teacher = teachers.find(t => t.id === teacherId);
    toast({
      title: "Status Updated",
      description: `${teacher?.name}'s status changed to ${newStatus}`
    });
  };

  const handleDeleteTeacher = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    setTeachers(teachers.filter(t => t.id !== teacherId));
    
    toast({
      title: "Teacher Removed",
      description: `${teacher?.name} has been removed from the system`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    total: teachers.length,
    active: teachers.filter(t => t.status === "active").length,
    pending: teachers.filter(t => t.status === "pending").length,
    suspended: teachers.filter(t => t.status === "suspended").length
  };

  return (
    <div className="space-y-4 sm:space-y-6 container-responsive">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-responsive-xl font-bold text-wrap">Teacher Management</h2>
          <p className="text-responsive-sm text-muted-foreground text-wrap">Register and manage teacher accounts</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:shadow-glow gap-2 touch-target mobile-full-width sm:w-auto">
              <UserPlus className="h-4 w-4 flex-shrink-0" />
              <span className="text-wrap">Add Teacher</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Register New Teacher</DialogTitle>
              <DialogDescription>
                Add a new teacher to the system. They will receive login credentials via email.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter teacher's full name"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="teacher@university.edu"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  value={newTeacher.phone}
                  onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="Computer Science"
                  value={newTeacher.department}
                  onChange={(e) => setNewTeacher({...newTeacher, department: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjects">Subjects (comma-separated)</Label>
                <Input
                  id="subjects"
                  placeholder="Math, Physics, Chemistry"
                  value={newTeacher.subjects}
                  onChange={(e) => setNewTeacher({...newTeacher, subjects: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTeacher}>Register Teacher</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-full">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Teachers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold">{stats.suspended}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teachers by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Teachers</CardTitle>
          <CardDescription>Manage teacher accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="table-responsive">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px] sm:min-w-[200px]">Teacher</TableHead>
                  <TableHead className="min-w-[120px] sm:min-w-[150px] mobile-hidden tablet-table-cell">Department</TableHead>
                  <TableHead className="min-w-[150px] sm:min-w-[200px] mobile-hidden md:table-cell">Contact</TableHead>
                  <TableHead className="min-w-[80px] sm:min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[60px] sm:min-w-[80px] mobile-hidden sm:table-cell">Classes</TableHead>
                  <TableHead className="min-w-[70px] sm:min-w-[80px] mobile-hidden sm:table-cell">Students</TableHead>
                  <TableHead className="min-w-[80px] sm:min-w-[100px] mobile-hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="min-w-[100px] sm:min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{teacher.name}</p>
                      <p className="text-sm text-muted-foreground">{teacher.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="space-y-1">
                      <p className="font-medium">{teacher.department}</p>
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.slice(0, 2).map((subject, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {teacher.subjects.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{teacher.subjects.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span className="text-sm">{teacher.email}</span>
                      </div>
                      {teacher.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span className="text-sm">{teacher.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(teacher.status)}</TableCell>
                  <TableCell className="text-center">{teacher.classesAssigned}</TableCell>
                  <TableCell className="text-center">{teacher.studentsCount}</TableCell>
                  <TableCell>
                    {new Date(teacher.dateJoined).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {teacher.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(teacher.id, "active")}
                          className="h-8 px-2"
                        >
                          Approve
                        </Button>
                      )}
                      {teacher.status === "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(teacher.id, "suspended")}
                          className="h-8 px-2"
                        >
                          Suspend
                        </Button>
                      )}
                      {teacher.status === "suspended" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(teacher.id, "active")}
                          className="h-8 px-2"
                        >
                          Reactivate
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        className="h-8 px-2"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
