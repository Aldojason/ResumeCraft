import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Resume, InsertResume } from "@shared/schema";

export function useResumes(userId: string) {
  return useQuery({
    queryKey: ["/api/resumes/user", userId],
    enabled: !!userId,
  });
}

export function useResume(resumeId: string) {
  return useQuery({
    queryKey: ["/api/resumes", resumeId],
    enabled: !!resumeId,
  });
}

export function useCreateResume() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (resumeData: InsertResume) => {
      const response = await apiRequest("POST", "/api/resumes", resumeData);
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes/user", variables.userId] });
    },
  });
}

export function useUpdateResume() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertResume> }) => {
      const response = await apiRequest("PUT", `/api/resumes/${id}`, data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes", data.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/resumes/user", data.userId] });
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/resumes/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
    },
  });
}

// Auto-save hook
export function useAutoSave(resumeId: string, resumeData: any, enabled = true) {
  const updateResume = useUpdateResume();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (!enabled || !resumeId || !resumeData) return;

    const timeoutId = setTimeout(() => {
      updateResume.mutate(
        { id: resumeId, data: resumeData },
        {
          onSuccess: () => {
            setLastSaved(new Date());
          },
        }
      );
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [resumeData, resumeId, enabled, updateResume]);

  return { lastSaved, isSaving: updateResume.isPending };
}
