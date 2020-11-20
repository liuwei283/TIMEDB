class SamplesController < ApplicationController
    http_basic_authenticate_with name: "admin", password: "chelijia",
    except: [:show]

    def new
        @project = Project.find(params[:project_id])
        @sample = @project.samples.build
    end

    def show
        @project = Project.find(params[:project_id])
        @sample = @project.samples.find(params[:id])
    end

    def create
        @project = Project.find(params[:project_id])
        @sample = @project.samples.create(sample_params)
        @project.update_attribute(:num_of_samples, @project.samples.count)
        @sample.update_attribute(:project_name, @project.name)
        if @sample.save
            redirect_to project_path(@project)
        else
            render 'new'
        end
    end

    def destroy
        @project = Project.find(params[:project_id])
        @sample = @project.samples.find(params[:id])
        @sample.destroy
        @project.update_attribute(:num_of_samples, @project.samples.count)
        redirect_to project_path(@project)
    end

    def edit
        @project = Project.find(params[:project_id])
        @sample = @project.samples.find(params[:id])
    end
    
    def update
        @project = Project.find(params[:project_id])
        @sample = @project.samples.find(params[:id])
         
        if @sample.update(sample_params)
            update_metadata
            redirect_to @project
        else
            render 'edit'
        end
    end

    def import
        @project = Project.find(params[:project_id])
        Sample.import(params[:file],params[:project_id] )
        @project.update_attribute(:num_of_samples, @project.samples.count)
        update_metadata
        redirect_to project_path(@project), notice: "Samples imported."
    end

    def export_selected
        @samples = Sample.order(:sample_name)
        respond_to do |format|
            format.csv {send_data @samples.selected_to_csv(params[:sample_ids])}
        end
    end

    def upload_seq
        @project = Project.find(params[:project_id])
        @sample = @project.samples.find(params[:id])
        n1 = @project.name
        n2 = @sample.sample_name
        up_file = params[:seq_file]
        uploader = SeqUploader.new(n1, n2)
        uploader.store!(up_file)
        redirect_to project_sample_path
    end


    private
        def update_metadata
            @project = Project.find(params[:project_id])
            db_samples_info_path = File.join Rails.root, 'app', 'data', 'db', params[:project_id] +'_samples_metadata.csv'
            csv_file = @project.samples.to_csv
            File.open(db_samples_info_path, 'w') do |file|
                file << csv_file
            end
        end

        def send_selected
        end

        def sample_params
            params.require(:sample).permit(:sample_name, :host_age, :seq_file)
        end
end
