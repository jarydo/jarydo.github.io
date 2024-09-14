import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import * as resume from '../../resume.json';

// TODO: add proper images, external links
const Projects = () => { 
    return (
        <section id="projects" className="min-h-screen flex items-center justify-center pt-32">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-6xl font-bold text-center text-white mb-8">Selected Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resume.projects.map((project, index) => (
                    <Card key={index} className="flex flex-col">
                    <CardHeader>
                        <img src={project.image_url} alt={project.name} className="w-full h-48 object-cover rounded-t-lg" />
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <CardTitle className="text-xl mb-2">{project.name}</CardTitle>
                        <CardDescription className="text-gray-600 mb-4">{project.description}</CardDescription>
                        <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="secondary">{tech}</Badge>
                        ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm" asChild>
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            {/* <Github className="w-4 h-4 mr-2" /> */}
                            GitHub
                        </a>
                        </Button>
                        {project.live_url && (
                        <Button variant="outline" size="sm" asChild>
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                            {/* <ExternalLink className="w-4 h-4 mr-2" /> */}
                            Live Demo
                            </a>
                        </Button>
                        )}
                    </CardFooter>
                    </Card>
                ))}
                </div>
            </div>
        </section>
    )
}

export default Projects;