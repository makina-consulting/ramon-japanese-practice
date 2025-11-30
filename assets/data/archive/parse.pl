#!/usr/bin/perl

use FileHandle;
$InputFile = "vocab.json";
$INFH = new FileHandle($InputFile,"r");
while ($line = <$INFH>) {
   if ($line =~ /\"lessonSection.*Genki 1::L(\d+).*\"/) {
      printf "    \"lessonSection\": \"%s\",\n", $1;
   } elsif ($line =~ /\"category\": \"(\S+)\"/) {
      $category = $1;
      $category =~ s/_/ /g;
      printf "    \"category\": \"%s\",\n", $category;
   } else {
      print $line;
   }
}
