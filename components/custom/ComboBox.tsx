"use client&quot;

import * as React from &quot;react&quot;
import { Check, ChevronsUpDown } from &quot;lucide-react&quot;

import { cn } from &quot;@/lib/utils&quot;
import { Button } from &quot;@/components/ui/button&quot;
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from &quot;@/components/ui/command&quot;
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from &quot;@/components/ui/popover&quot;

interface ComboBoxProps {
  options: { label: string, value: string }[]
  value?: string
  onChange: (value: string) => void
}

export function ComboBox({ options, value, onChange }: ComboBoxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant=&quot;outline&quot;
          role=&quot;combobox&quot;
          aria-expanded={open}
          className=&quot;w-[200px] justify-between&quot;
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : &quot;Select option...&quot;}
          <ChevronsUpDown className=&quot;ml-2 h-4 w-4 shrink-0 opacity-50&quot; />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=&quot;w-[200px] p-0&quot;>
        <Command>
          <CommandInput placeholder=&quot;Search option...&quot; />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => {
                  onChange(option.value === value ? &quot;" : option.value)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    &quot;mr-2 h-4 w-4&quot;,
                    value === option.value ? &quot;opacity-100&quot; : &quot;opacity-0&quot;
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
