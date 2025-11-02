<template>
    <div class="max-w-7xl mx-auto space-y-6">
        <!-- Basics Section -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4 flex-wrap gap-4">
                <h3 class="text-2xl font-semibold">Basic Information</h3>
                <div class="flex gap-4">
                    <Button variant="outline" @click="resetForm">Reset</Button>
                    <Button @click="saveResume">Save Resume</Button>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Name</label>
                    <Input v-model="localResume.basics!.name" placeholder="John Doe" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Label/Title</label>
                    <Input v-model="localResume.basics!.label" placeholder="Software Engineer" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Email</label>
                    <Input v-model="localResume.basics!.email" type="email" placeholder="john@example.com" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Phone</label>
                    <Input v-model="localResume.basics!.phone" placeholder="+1 (555) 123-4567" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Website URL</label>
                    <Input v-model="localResume.basics!.url" type="url" placeholder="https://johndoe.com" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Address</label>
                    <Input v-model="localResume.basics!.location!.address" placeholder="2712 Broadway St" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">City</label>
                    <Input v-model="localResume.basics!.location!.city" placeholder="New York" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Region/State</label>
                    <Input v-model="localResume.basics!.location!.region" placeholder="California" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Postal Code</label>
                    <Input v-model="localResume.basics!.location!.postalCode" placeholder="94115" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Country Code</label>
                    <Input v-model="localResume.basics!.location!.countryCode" placeholder="US" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Profile Image URL</label>
                    <Input v-model="localResume.basics!.image" type="url" placeholder="https://example.com/image.jpg" />
                </div>
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium mb-2">Summary</label>
                    <Textarea v-model="localResume.basics!.summary" :rows="4"
                        placeholder="Brief professional summary..." />
                </div>
            </div>

            <!-- Profiles Section -->
            <div class="mt-6">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="text-lg font-semibold">Social Profiles</h4>
                    <Button size="sm" @click="addProfile">Add Profile</Button>
                </div>
                <div v-for="(profile, index) in localResume.basics!.profiles || []" :key="index"
                    class="mb-4 p-4 border rounded-lg">
                    <div class="flex justify-between items-center mb-3">
                        <span class="font-semibold">Profile #{{ index + 1 }}</span>
                        <Button variant="destructive" size="sm" @click="removeProfile(index)">Remove</Button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Network</label>
                            <Input v-model="profile.network" placeholder="LinkedIn" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Username</label>
                            <Input v-model="profile.username" placeholder="username" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">URL</label>
                            <Input v-model="profile.url" type="url" placeholder="https://linkedin.com/in/username" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Work Experience -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold">Work Experience</h3>
                <Button @click="addWork">Add Work</Button>
            </div>
            <div v-for="(work, index) in localResume.work" :key="index" class="mb-4 p-4 border rounded-lg">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-semibold">Work #{{ index + 1 }}</h4>
                    <Button variant="destructive" size="sm" @click="removeWork(index)">Remove</Button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Company Name</label>
                        <Input v-model="work.name" placeholder="Company Inc." />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Position</label>
                        <Input v-model="work.position" placeholder="Software Engineer" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Company URL</label>
                        <Input v-model="work.url" type="url" placeholder="https://company.com" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Start Date</label>
                        <Input v-model="work.startDate" type="date" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">End Date</label>
                        <Input v-model="work.endDate" type="date" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium mb-2">Summary</label>
                        <Textarea v-model="work.summary" :rows="2" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium mb-2">Skills (comma-separated)</label>
                        <Input v-model="workSkills[index]" placeholder="JavaScript, Vue.js" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium mb-2">Highlights (one per line)</label>
                        <Textarea v-model="workHighlights[index]" :rows="4"
                            placeholder="Enter each highlight on a new line" @input="updateHighlights(index, $event)" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Education -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold">Education</h3>
                <Button @click="addEducation">Add Education</Button>
            </div>
            <div v-for="(edu, index) in localResume.education" :key="index" class="mb-4 p-4 border rounded-lg">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-semibold">Education #{{ index + 1 }}</h4>
                    <Button variant="destructive" size="sm" @click="removeEducation(index)">Remove</Button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Institution</label>
                        <Input v-model="edu.institution" placeholder="University Name" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Area of Study</label>
                        <Input v-model="edu.area" placeholder="Computer Science" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Degree Type</label>
                        <Input v-model="edu.studyType" placeholder="Bachelor's" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">GPA/Score</label>
                        <Input v-model="edu.score" placeholder="3.8" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Start Date</label>
                        <Input v-model="edu.startDate" type="date" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">End Date</label>
                        <Input v-model="edu.endDate" type="date" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Institution URL</label>
                        <Input v-model="edu.url" type="url" placeholder="https://university.edu" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium mb-2">Courses (one per line)</label>
                        <Textarea v-model="educationCourses[index]" :rows="3" placeholder="DB1101 - Basic SQL"
                            @input="updateCourses(index, $event)" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Volunteer -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold">Volunteer Experience</h3>
                <Button @click="addVolunteer">Add Volunteer</Button>
            </div>
            <div v-for="(vol, index) in localResume.volunteer" :key="index" class="mb-4 p-4 border rounded-lg">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-semibold">Volunteer #{{ index + 1 }}</h4>
                    <Button variant="destructive" size="sm" @click="removeVolunteer(index)">Remove</Button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Organization</label>
                        <Input v-model="vol.organization" placeholder="Organization Name" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Position</label>
                        <Input v-model="vol.position" placeholder="Volunteer" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Organization URL</label>
                        <Input v-model="vol.url" type="url" placeholder="https://organization.com" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Start Date</label>
                        <Input v-model="vol.startDate" type="date" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">End Date</label>
                        <Input v-model="vol.endDate" type="date" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium mb-2">Summary</label>
                        <Textarea v-model="vol.summary" :rows="2" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium mb-2">Highlights (one per line)</label>
                        <Textarea v-model="volunteerHighlights[index]" :rows="3"
                            placeholder="Enter each highlight on a new line"
                            @input="updateVolunteerHighlights(index, $event)" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Projects -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold">Projects</h3>
                <Button @click="addProject">Add Project</Button>
            </div>
            <div v-for="(project, index) in localResume.projects" :key="index" class="mb-4 p-4 border rounded-lg">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-semibold">Project #{{ index + 1 }}</h4>
                    <Button variant="destructive" size="sm" @click="removeProject(index)">Remove</Button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Project Name</label>
                        <Input v-model="project.name" placeholder="Project Name" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Project URL</label>
                        <Input v-model="project.url" type="url" placeholder="https://project.com" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Start Date</label>
                        <Input v-model="project.startDate" type="date" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">End Date</label>
                        <Input v-model="project.endDate" type="date" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium mb-2">Description</label>
                        <Textarea v-model="project.description" :rows="3" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium mb-2">Highlights (one per line)</label>
                        <Textarea v-model="projectHighlights[index]" :rows="3"
                            placeholder="Enter each highlight on a new line"
                            @input="updateProjectHighlights(index, $event)" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Awards -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold">Awards</h3>
                <Button @click="addAward">Add Award</Button>
            </div>
            <div v-for="(award, index) in localResume.awards" :key="index" class="mb-4 p-4 border rounded-lg">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-semibold">Award #{{ index + 1 }}</h4>
                    <Button variant="destructive" size="sm" @click="removeAward(index)">Remove</Button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Title</label>
                        <Input v-model="award.title" placeholder="Award Title" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Date</label>
                        <Input v-model="award.date" type="date" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Awarder</label>
                        <Input v-model="award.awarder" placeholder="Company Name" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium mb-2">Summary</label>
                        <Textarea v-model="award.summary" :rows="2" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Publications -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold">Publications</h3>
                <Button @click="addPublication">Add Publication</Button>
            </div>
            <div v-for="(pub, index) in localResume.publications" :key="index" class="mb-4 p-4 border rounded-lg">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-semibold">Publication #{{ index + 1 }}</h4>
                    <Button variant="destructive" size="sm" @click="removePublication(index)">Remove</Button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Name</label>
                        <Input v-model="pub.name" placeholder="Publication Name" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Publisher</label>
                        <Input v-model="pub.publisher" placeholder="Publisher Name" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Release Date</label>
                        <Input v-model="pub.releaseDate" type="date" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">URL</label>
                        <Input v-model="pub.url" type="url" placeholder="https://publication.com" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium mb-2">Summary</label>
                        <Textarea v-model="pub.summary" :rows="3" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Certificates -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold">Certificates</h3>
                <Button @click="addCertificate">Add Certificate</Button>
            </div>
            <div v-for="(cert, index) in localResume.certificates" :key="index" class="mb-4 p-4 border rounded-lg">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-semibold">Certificate #{{ index + 1 }}</h4>
                    <Button variant="destructive" size="sm" @click="removeCertificate(index)">Remove</Button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Name</label>
                        <Input v-model="cert.name" placeholder="Certificate Name" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Date</label>
                        <Input v-model="cert.date" type="date" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Issuer</label>
                        <Input v-model="cert.issuer" placeholder="Issuing Organization" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">URL</label>
                        <Input v-model="cert.url" type="url" placeholder="https://certificate.com" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Languages -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold">Languages</h3>
                <Button @click="addLanguage">Add Language</Button>
            </div>
            <div v-for="(lang, index) in localResume.languages" :key="index" class="mb-4 p-4 border rounded-lg">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-semibold">Language #{{ index + 1 }}</h4>
                    <Button variant="destructive" size="sm" @click="removeLanguage(index)">Remove</Button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Language</label>
                        <Input v-model="lang.language" placeholder="English" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Fluency</label>
                        <Input v-model="lang.fluency" placeholder="Native speaker" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Interests -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold">Interests</h3>
                <Button @click="addInterest">Add Interest</Button>
            </div>
            <div v-for="(interest, index) in localResume.interests" :key="index" class="mb-4 p-4 border rounded-lg">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-semibold">Interest #{{ index + 1 }}</h4>
                    <Button variant="destructive" size="sm" @click="removeInterest(index)">Remove</Button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Name</label>
                        <Input v-model="interest.name" placeholder="Wildlife" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
                        <Input v-model="interestKeywords[index]" placeholder="Ferrets, Unicorns" />
                    </div>
                </div>
            </div>
        </div>

        <!-- References -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold">References</h3>
                <Button @click="addReference">Add Reference</Button>
            </div>
            <div v-for="(ref, index) in localResume.references" :key="index" class="mb-4 p-4 border rounded-lg">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-semibold">Reference #{{ index + 1 }}</h4>
                    <Button variant="destructive" size="sm" @click="removeReference(index)">Remove</Button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Name</label>
                        <Input v-model="ref.name" placeholder="Jane Doe" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium mb-2">Reference</label>
                        <Textarea v-model="ref.reference" :rows="3" placeholder="Reference details..." />
                    </div>
                </div>
            </div>
        </div>

        <!-- Skills -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold">Skills</h3>
                <Button @click="addSkill">Add Skill</Button>
            </div>
            <div v-for="(skill, index) in localResume.skills" :key="index" class="mb-4 p-4 border rounded-lg">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-semibold">Skill #{{ index + 1 }}</h4>
                    <Button variant="destructive" size="sm" @click="removeSkill(index)">Remove</Button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Skill Name</label>
                        <Input v-model="skill.name" placeholder="Web Development" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Level</label>
                        <Input v-model="skill.level" placeholder="Expert" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
                        <Input v-model="skillKeywords[index]" placeholder="React, Vue, TypeScript" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { Resume } from '../types/resume';
import Button from './ui/Button.vue';
import Input from './ui/Input.vue';
import Textarea from './ui/Textarea.vue';
import { saveResumeToStorage } from '../utils/storage';

const props = defineProps<{
    resumeData: Resume;
}>();

const emit = defineEmits<{
    update: [data: Resume];
}>();

const localResume = reactive<Resume>({
    basics: {
        name: '',
        label: '',
        email: '',
        phone: '',
        url: '',
        summary: '',
        location: {
            city: '',
        },
        profiles: [],
    },
    work: [],
    volunteer: [],
    education: [],
    awards: [],
    certificates: [],
    publications: [],
    skills: [],
    languages: [],
    interests: [],
    references: [],
    projects: [],
});

const workHighlights = ref<string[]>([]);
const workSkills = ref<string[]>([]);
const skillKeywords = ref<string[]>([]);
const educationCourses = ref<string[]>([]);
const volunteerHighlights = ref<string[]>([]);
const projectHighlights = ref<string[]>([]);
const interestKeywords = ref<string[]>([]);

watch(
    () => props.resumeData,
    (newData) => {
        if (newData) {
            const data = JSON.parse(JSON.stringify(newData));
            // Ensure basics and location always exist
            if (!data.basics) data.basics = {};
            if (!data.basics.location) data.basics.location = {};
            Object.assign(localResume, data);
            workHighlights.value = (localResume.work || []).map((w) => (w.highlights || []).join('\n'));
            workSkills.value = (localResume.work || []).map((w) => (w.skills || []).join(', '));
            skillKeywords.value = (localResume.skills || []).map((s) => (s.keywords || []).join(', '));
            educationCourses.value = (localResume.education || []).map((e) => (e.courses || []).join('\n'));
            volunteerHighlights.value = (localResume.volunteer || []).map((v) => (v.highlights || []).join('\n'));
            projectHighlights.value = (localResume.projects || []).map((p) => (p.highlights || []).join('\n'));
            interestKeywords.value = (localResume.interests || []).map((i) => (i.keywords || []).join(', '));
        }
    },
    { immediate: true, deep: true }
);

function updateHighlights(index: number, event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    workHighlights.value[index] = value;
    if (localResume.work && localResume.work[index]) {
        localResume.work[index].highlights = value.split('\n').filter(Boolean);
    }
}

watch(skillKeywords, (newKeywords) => {
    newKeywords.forEach((keywords, index) => {
        if (localResume.skills && localResume.skills[index]) {
            localResume.skills[index].keywords = keywords.split(',').map((k) => k.trim()).filter(Boolean);
        }
    });
}, { deep: true });

watch(workSkills, (newSkills) => {
    newSkills.forEach((skills, index) => {
        if (localResume.work && localResume.work[index]) {
            localResume.work[index].skills = skills.split(',').map((s) => s.trim()).filter(Boolean);
        }
    });
}, { deep: true });

watch(interestKeywords, (newKeywords) => {
    newKeywords.forEach((keywords, index) => {
        if (localResume.interests && localResume.interests[index]) {
            localResume.interests[index].keywords = keywords.split(',').map((k) => k.trim()).filter(Boolean);
        }
    });
}, { deep: true });

function updateCourses(index: number, event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    educationCourses.value[index] = value;
    if (localResume.education && localResume.education[index]) {
        localResume.education[index].courses = value.split('\n').filter(Boolean);
    }
}

function updateVolunteerHighlights(index: number, event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    volunteerHighlights.value[index] = value;
    if (localResume.volunteer && localResume.volunteer[index]) {
        localResume.volunteer[index].highlights = value.split('\n').filter(Boolean);
    }
}

function updateProjectHighlights(index: number, event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    projectHighlights.value[index] = value;
    if (localResume.projects && localResume.projects[index]) {
        localResume.projects[index].highlights = value.split('\n').filter(Boolean);
    }
}

function addWork() {
    if (!localResume.work) localResume.work = [];
    localResume.work.push({
        name: '',
        position: '',
        startDate: '',
        endDate: '',
        summary: '',
        highlights: [],
        skills: [],
    });
    workHighlights.value.push('');
    workSkills.value.push('');
}

function removeWork(index: number) {
    if (localResume.work) {
        localResume.work.splice(index, 1);
        workHighlights.value.splice(index, 1);
        workSkills.value.splice(index, 1);
    }
}

function addEducation() {
    if (!localResume.education) localResume.education = [];
    localResume.education.push({
        institution: '',
        area: '',
        studyType: '',
        startDate: '',
        endDate: '',
        score: '',
        courses: [],
    });
    educationCourses.value.push('');
}

function removeEducation(index: number) {
    if (localResume.education) {
        localResume.education.splice(index, 1);
        educationCourses.value.splice(index, 1);
    }
}

function addSkill() {
    if (!localResume.skills) localResume.skills = [];
    localResume.skills.push({
        name: '',
        level: '',
        keywords: [],
    });
    skillKeywords.value.push('');
}

function removeSkill(index: number) {
    if (localResume.skills) {
        localResume.skills.splice(index, 1);
        skillKeywords.value.splice(index, 1);
    }
}

function saveResume() {
    const resumeToSave = JSON.parse(JSON.stringify(localResume));
    emit('update', resumeToSave);
    // Save to localStorage
    try {
        saveResumeToStorage(resumeToSave);
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}

function addProfile() {
    if (!localResume.basics) localResume.basics = {};
    if (!localResume.basics.profiles) localResume.basics.profiles = [];
    localResume.basics.profiles.push({
        network: '',
        username: '',
        url: '',
    });
}

function removeProfile(index: number) {
    if (localResume.basics?.profiles) {
        localResume.basics.profiles.splice(index, 1);
    }
}

function addVolunteer() {
    if (!localResume.volunteer) localResume.volunteer = [];
    localResume.volunteer.push({
        organization: '',
        position: '',
        startDate: '',
        endDate: '',
        summary: '',
        highlights: [],
    });
    volunteerHighlights.value.push('');
}

function removeVolunteer(index: number) {
    if (localResume.volunteer) {
        localResume.volunteer.splice(index, 1);
        volunteerHighlights.value.splice(index, 1);
    }
}

function addProject() {
    if (!localResume.projects) localResume.projects = [];
    localResume.projects.push({
        name: '',
        startDate: '',
        endDate: '',
        description: '',
        highlights: [],
    });
    projectHighlights.value.push('');
}

function removeProject(index: number) {
    if (localResume.projects) {
        localResume.projects.splice(index, 1);
        projectHighlights.value.splice(index, 1);
    }
}

function addAward() {
    if (!localResume.awards) localResume.awards = [];
    localResume.awards.push({
        title: '',
        date: '',
        awarder: '',
        summary: '',
    });
}

function removeAward(index: number) {
    if (localResume.awards) {
        localResume.awards.splice(index, 1);
    }
}

function addPublication() {
    if (!localResume.publications) localResume.publications = [];
    localResume.publications.push({
        name: '',
        publisher: '',
        releaseDate: '',
        url: '',
        summary: '',
    });
}

function removePublication(index: number) {
    if (localResume.publications) {
        localResume.publications.splice(index, 1);
    }
}

function addCertificate() {
    if (!localResume.certificates) localResume.certificates = [];
    localResume.certificates.push({
        name: '',
        date: '',
        issuer: '',
        url: '',
    });
}

function removeCertificate(index: number) {
    if (localResume.certificates) {
        localResume.certificates.splice(index, 1);
    }
}

function addLanguage() {
    if (!localResume.languages) localResume.languages = [];
    localResume.languages.push({
        language: '',
        fluency: '',
    });
}

function removeLanguage(index: number) {
    if (localResume.languages) {
        localResume.languages.splice(index, 1);
    }
}

function addInterest() {
    if (!localResume.interests) localResume.interests = [];
    localResume.interests.push({
        name: '',
        keywords: [],
    });
    interestKeywords.value.push('');
}

function removeInterest(index: number) {
    if (localResume.interests) {
        localResume.interests.splice(index, 1);
        interestKeywords.value.splice(index, 1);
    }
}

function addReference() {
    if (!localResume.references) localResume.references = [];
    localResume.references.push({
        name: '',
        reference: '',
    });
}

function removeReference(index: number) {
    if (localResume.references) {
        localResume.references.splice(index, 1);
    }
}

function resetForm() {
    Object.assign(localResume, {
        basics: {
            name: '',
            label: '',
            email: '',
            phone: '',
            url: '',
            summary: '',
            location: { city: '' },
            profiles: [],
        },
        work: [],
        volunteer: [],
        education: [],
        awards: [],
        certificates: [],
        publications: [],
        skills: [],
        languages: [],
        interests: [],
        references: [],
        projects: [],
    });
    workHighlights.value = [];
    workSkills.value = [];
    skillKeywords.value = [];
    educationCourses.value = [];
    volunteerHighlights.value = [];
    projectHighlights.value = [];
    interestKeywords.value = [];
}
</script>
