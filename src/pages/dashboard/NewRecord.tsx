
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SecureDashboardLayout } from '@/components/layout/SecureDashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const recordSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  mailingAddress: z.string().min(1, 'Mailing address is required'),
  propertyStreet: z.string().min(1, 'Property street is required'),
  propertyCity: z.string().min(1, 'Property city is required'),
  propertyState: z.string().min(2, 'Property state is required').max(2, 'Use state abbreviation'),
  propertyZip: z.string().min(5, 'Property ZIP is required').max(10, 'Invalid ZIP code'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional().or(z.literal('')),
  notes: z.string().optional(),
})

type RecordFormValues = z.infer<typeof recordSchema>

export default function NewRecord() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const form = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      mailingAddress: '',
      propertyStreet: '',
      propertyCity: '',
      propertyState: '',
      propertyZip: '',
      email: '',
      phone: '',
      notes: '',
    },
  })

  const onSubmit = async (values: RecordFormValues) => {
    if (!user) return

    setLoading(true)
    try {
      // Use a simplified query approach
      const { data, error } = await supabase
        .from('records')
        .insert({
          user_id: user.id,
          first_name: values.firstName,
          last_name: values.lastName,
          mailing_address: values.mailingAddress,
          property_street: values.propertyStreet,
          property_city: values.propertyCity,
          property_state: values.propertyState,
          property_zip: values.propertyZip,
          email: values.email,
          phone: values.phone,
          notes: values.notes,
        })
        .select()

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Record created successfully',
      })

      navigate(`/dashboard/records/${data[0].id}`)
    } catch (error) {
      console.error('Error creating record:', error)
      toast({
        title: 'Error',
        description: 'Failed to create record',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <SecureDashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">New Record</h1>
          <Button variant="outline" onClick={() => navigate('/dashboard/records')}>
            Back to Records
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Owner Information</CardTitle>
                <CardDescription>
                  Enter the property owner's details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="mailingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mailing Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
                <CardDescription>
                  Enter the property's location details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="propertyStreet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="propertyCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="propertyState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} maxLength={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="propertyZip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Enter any known contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Add any additional notes about this record
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/records')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Record'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </SecureDashboardLayout>
  )
}
