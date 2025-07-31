import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';

interface PlayerDetailsProps {
  onDetailsChange: (details: PlayerDetails) => void;
}

export interface PlayerDetails {
  name: string;
  age: string;
  height: string;
  weight: string;
  gender: string;
}

export const PlayerDetails = ({ onDetailsChange }: PlayerDetailsProps) => {
  const [details, setDetails] = useState<PlayerDetails>({
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: ''
  });

  const updateDetails = (field: keyof PlayerDetails, value: string) => {
    const newDetails = { ...details, [field]: value };
    setDetails(newDetails);
    onDetailsChange(newDetails);
  };

  return (
    <Card className="relative backdrop-blur-xl bg-glass border-glass-border p-6 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 rounded-lg" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/20">
            <User className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Player Details</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={details.name}
              onChange={(e) => updateDetails('name', e.target.value)}
              className="bg-secondary/50 border-border/50 backdrop-blur-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium text-muted-foreground">
              Age
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="25"
              value={details.age}
              onChange={(e) => updateDetails('age', e.target.value)}
              className="bg-secondary/50 border-border/50 backdrop-blur-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm font-medium text-muted-foreground">
              Height (cm)
            </Label>
            <Input
              id="height"
              type="number"
              placeholder="175"
              value={details.height}
              onChange={(e) => updateDetails('height', e.target.value)}
              className="bg-secondary/50 border-border/50 backdrop-blur-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium text-muted-foreground">
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              placeholder="70"
              value={details.weight}
              onChange={(e) => updateDetails('weight', e.target.value)}
              className="bg-secondary/50 border-border/50 backdrop-blur-sm"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="gender" className="text-sm font-medium text-muted-foreground">
              Gender
            </Label>
            <Select value={details.gender} onValueChange={(value) => updateDetails('gender', value)}>
              <SelectTrigger className="bg-secondary/50 border-border/50 backdrop-blur-sm">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
};