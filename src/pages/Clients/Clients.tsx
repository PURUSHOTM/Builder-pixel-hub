import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Phone,
  Mail,
  Building,
  MapPin,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Modal, FormModal } from "../../components/common";
import { useModals } from "../../hooks/use-modal";
import { ClientsApi } from "../../lib/api/client";
import { toast } from "sonner";

interface Client {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ClientFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes: string;
}

const initialFormData: ClientFormData = {
  name: "",
  email: "",
  company: "",
  phone: "",
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  },
  notes: "",
};

// Move ClientForm outside of the main component to prevent recreation
interface ClientFormProps {
  formData: ClientFormData;
  onInputChange: (field: string, value: string) => void;
  onAddressChange: (field: string, value: string) => void;
}

const ClientForm: React.FC<ClientFormProps> = React.memo(
  ({ formData, onInputChange, onAddressChange }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange("name", e.target.value)}
            placeholder="John Doe"
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            placeholder="john@example.com"
            autoComplete="email"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => onInputChange("company", e.target.value)}
            placeholder="Acme Corp"
            autoComplete="organization"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onInputChange("phone", e.target.value)}
            placeholder="+1 234 567 8900"
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Address</h4>
        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            value={formData.address.street}
            onChange={(e) => onAddressChange("street", e.target.value)}
            placeholder="123 Main St"
            autoComplete="street-address"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.address.city}
              onChange={(e) => onAddressChange("city", e.target.value)}
              placeholder="San Francisco"
              autoComplete="address-level2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.address.state}
              onChange={(e) => onAddressChange("state", e.target.value)}
              placeholder="CA"
              autoComplete="address-level1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              value={formData.address.zipCode}
              onChange={(e) => onAddressChange("zipCode", e.target.value)}
              placeholder="94105"
              autoComplete="postal-code"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.address.country}
              onChange={(e) => onAddressChange("country", e.target.value)}
              placeholder="United States"
              autoComplete="country-name"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => onInputChange("notes", e.target.value)}
          placeholder="Additional notes about this client..."
          rows={3}
        />
      </div>
    </div>
  ),
);

export function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  // Modal management using the custom hook
  const modals = useModals(["create", "edit", "view", "delete"]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClients, setTotalClients] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchClients();
  }, [currentPage, searchTerm]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await ClientsApi.getClients({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      });

      if (response.success) {
        setClients(response.data || []);
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
          setTotalClients(response.pagination.total);
        }
      }
    } catch (error: any) {
      console.error("Error fetching clients:", error);
      toast.error(error.message || "Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCreate = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      // Basic validation
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.company.trim()
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      try {
        setSubmitting(true);
        const response = await ClientsApi.createClient(formData);

        if (response.success) {
          toast.success("Client created successfully");
          modals.create.close();
          setFormData(initialFormData);
          fetchClients();
        }
      } catch (error: any) {
        console.error("Error creating client:", error);
        toast.error(error.message || "Failed to create client");
      } finally {
        setSubmitting(false);
      }
    },
    [formData, modals.create],
  );

  const handleEdit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      if (!selectedClient) return;

      // Basic validation
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.company.trim()
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      try {
        setSubmitting(true);
        const response = await ClientsApi.updateClient(
          selectedClient._id,
          formData,
        );

        if (response.success) {
          toast.success("Client updated successfully");
          modals.edit.close();
          setSelectedClient(null);
          setFormData(initialFormData);
          fetchClients();
        }
      } catch (error: any) {
        console.error("Error updating client:", error);
        toast.error(error.message || "Failed to update client");
      } finally {
        setSubmitting(false);
      }
    },
    [selectedClient, formData, modals.edit],
  );

  const handleDelete = useCallback(async () => {
    if (!selectedClient) return;

    try {
      setSubmitting(true);
      const response = await ClientsApi.deleteClient(selectedClient._id);

      if (response.success) {
        toast.success("Client deleted successfully");
        modals.delete.close();
        setSelectedClient(null);
        fetchClients();
      }
    } catch (error: any) {
      console.error("Error deleting client:", error);
      toast.error(error.message || "Failed to delete client");
    } finally {
      setSubmitting(false);
    }
  }, [selectedClient, modals.delete]);

  const openEditDialog = useCallback(
    (client: Client) => {
      setSelectedClient(client);
      setFormData({
        name: client.name,
        email: client.email,
        company: client.company,
        phone: client.phone || "",
        address: {
          street: client.address?.street || "",
          city: client.address?.city || "",
          state: client.address?.state || "",
          zipCode: client.address?.zipCode || "",
          country: client.address?.country || "United States",
        },
        notes: client.notes || "",
      });
      modals.edit.open();
    },
    [modals.edit],
  );

  const openViewDialog = useCallback(
    (client: Client) => {
      setSelectedClient(client);
      modals.view.open();
    },
    [modals.view],
  );

  const openDeleteDialog = useCallback(
    (client: Client) => {
      setSelectedClient(client);
      modals.delete.open();
    },
    [modals.delete],
  );

  // Reset form data when modals close
  const resetFormData = useCallback(() => {
    setFormData(initialFormData);
    setSelectedClient(null);
  }, []);

  const getClientInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatAddress = (address?: Client["address"]) => {
    if (!address) return "No address provided";
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "No address provided";
  };

  // Memoized input handlers to prevent unnecessary re-renders
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAddressChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage your client relationships and contact information
          </p>
        </div>
        <Button
          className="gap-2 bg-primary hover:bg-primary/90"
          onClick={modals.create.open}
        >
          <Plus className="w-4 h-4" />
          Add Client
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search clients by name, company, or email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Active client relationships
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                clients.filter((client) => {
                  const clientDate = new Date(client.createdAt);
                  const now = new Date();
                  return (
                    clientDate.getMonth() === now.getMonth() &&
                    clientDate.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">New clients added</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(totalClients * 0.7)}
            </div>
            <p className="text-xs text-muted-foreground">
              Ongoing collaborations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Clients ({totalClients})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading clients...</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm ? "No clients found" : "No clients yet"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {searchTerm
                  ? "Try adjusting your search criteria to find what you're looking for."
                  : "Start building your client base by adding your first client."}
              </p>
              {!searchTerm && (
                <Button onClick={modals.create.open}>
                  Add Your First Client
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {getClientInitials(client.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{client.name}</div>
                              {client.notes && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs mt-1"
                                >
                                  Has Notes
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            {client.company}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-3 h-3 text-muted-foreground" />
                              {client.email}
                            </div>
                            {client.phone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-3 h-3" />
                                {client.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-32">
                              {formatAddress(client.address)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(client.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => openViewDialog(client)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openEditDialog(client)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(client)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, totalClients)} of{" "}
                    {totalClients} clients
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm px-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Client Modal */}
      <FormModal
        isOpen={modals.create.isOpen}
        onClose={() => {
          modals.create.close();
          resetFormData();
        }}
        onSubmit={handleCreate}
        title="Add New Client"
        submitLabel="Create Client"
        isSubmitting={submitting}
        size="lg"
      >
        <ClientForm
          formData={formData}
          onInputChange={handleInputChange}
          onAddressChange={handleAddressChange}
        />
      </FormModal>

      {/* Edit Client Modal */}
      <FormModal
        isOpen={modals.edit.isOpen}
        onClose={() => {
          modals.edit.close();
          resetFormData();
        }}
        onSubmit={handleEdit}
        title="Edit Client"
        submitLabel="Save Changes"
        isSubmitting={submitting}
        size="lg"
      >
        <ClientForm
          formData={formData}
          onInputChange={handleInputChange}
          onAddressChange={handleAddressChange}
        />
      </FormModal>

      {/* View Client Modal */}
      <Modal
        isOpen={modals.view.isOpen}
        onClose={modals.view.close}
        title="Client Details"
        size="lg"
      >
        {selectedClient && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {getClientInitials(selectedClient.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-2xl font-semibold">
                  {selectedClient.name}
                </h3>
                <p className="text-muted-foreground">
                  {selectedClient.company}
                </p>
                <Badge variant="secondary" className="mt-2">
                  Client since{" "}
                  {new Date(selectedClient.createdAt).toLocaleDateString()}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedClient.email}</span>
                  </div>
                  {selectedClient.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedClient.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedClient.company}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Address</h4>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    {formatAddress(selectedClient.address)}
                  </div>
                </div>
              </div>
            </div>

            {selectedClient.notes && (
              <div className="space-y-2">
                <h4 className="font-semibold">Notes</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {selectedClient.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.close}
        title="Are you sure?"
        description={`This will permanently delete the client "${selectedClient?.name}" and all associated data. This action cannot be undone.`}
        size="sm"
      >
        <Modal.Footer>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={modals.delete.close}
              disabled={submitting}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
              className="flex-1 sm:flex-none"
            >
              {submitting ? "Deleting..." : "Delete Client"}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
