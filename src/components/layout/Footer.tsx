const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Sole Mate. All rights reserved.</p>
        <p className="text-sm mt-1">Find Your Perfect Pair</p>
      </div>
    </footer>
  );
};

export default Footer;
