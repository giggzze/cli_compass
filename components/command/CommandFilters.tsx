"use client";

import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";

interface CommandFiltersProps {
  showFavorites: boolean;
  showUserCommands: boolean;
  onFavoritesChange: (checked: boolean) => void;
  onUserCommandsChange: (checked: boolean) => void;
}

export default function CommandFilters({
  showFavorites,
  showUserCommands,
  onFavoritesChange,
  onUserCommandsChange,
}: CommandFiltersProps) {
  return (
    <div className="flex justify-center gap-6 items-center my-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="favorites"
          checked={showFavorites}
          onCheckedChange={onFavoritesChange}
        />
        <Label htmlFor="favorites">Show Favorites Only</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="user-commands"
          checked={showUserCommands}
          onCheckedChange={onUserCommandsChange}
        />
        <Label htmlFor="user-commands">My Commands Only</Label>
      </div>
    </div>
  );
}
