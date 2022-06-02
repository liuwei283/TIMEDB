class SamplesController < ApplicationController
    http_basic_authenticate_with name: "admin", password: "Lovelace", only: [:new, :create, :edit, :new, :update, :destroy]
    $seq_dir = "#{Rails.root}/app/data/seq/"
    $inf_dir = "#{Rails.root}/public/data/sample_plot/"
    $tmp_dir = "#{Rails.root}/app/data/tmp/"

    def index
        @projects = Project.all
        # @all_sample_attrs = Sample.column_names
        # @projects.each do |project|
        #     #file_path = "#{Rails.root}/public/data/Clinical/project/" + project.project_name
        #     file_path = "#{Rails.root}/public/data/Clinical/ClinicaldataTest.csv"

        #     sub_headers = CSV.open(file_path, &:readline)
        #     Rails.logger.info(sub_headers.class)
        #     @all_sample_attrs = @all_sample_attrs | sub_headers
        # #     #logger.debug "sdwdwdwdwd"
        # end
        
        @vis = ['id', 'sample_name', 'project_name', 'c_tumor_stage', 'c_tumor_grade', 'c_sample_histology', 'c_race', 'c_gender', 'n_age', 'pfs', 'os', 'pfs_status', 'os_status', 'c_tumor_type', 'c_tumor_subtype', 'c_source_name', 'c_treatment']
        @samples = Sample.order(:sample_name)
        @sample_attrs = Sample.column_names
        @invis = []
        @sample_attrs.each_with_index do |attr, index|
            if !@vis.include?(attr)
                @invis.push(index+1)
            end
        end
        gon.push invis: @invis
        @user = User.find(session[:user_id])
        id = session[:user_id]
        @user = User.find(id)
        @datasets = @user.datasets
        respond_to do |format|
            format.html
            format.csv { send_data @samples.to_csv }
            format.json { 
                json_data =  SampleDatatable.new(view_context).as_json
                render json: json_data
            }
        end
    end

    def new
        @project = Project.find(params[:project_id])
        @sample = @project.samples.build
        @sample_attrs = Sample.column_names
    end

    def show
        @project = Project.find(params[:project_id])
        @sample = @project.samples.find(params[:id])
        @attrs = Sample.column_names
        inf_name = "#{@project.project_name}_#{@sample.sample_name}.tsv"
        inf_url = File.join("/public/data/sample_plot/", inf_name)
        inf_path = File.join($inf_dir, inf_name)
        @inf_exist = (File.exist?(inf_path)) && (File.size(inf_path)>100)

        pname = @project.project_name
        sname = @sample.sample_name
        sample_clinical_file_path = "#{Rails.root}/public/data/clinical/sample/Clinical_#{pname}.csv"
        samples_info = CSV.parse(File.read(sample_clinical_file_path), headers: TRUE)
        
        @table_headers = samples_info.headers
        @sample_row = samples_info.find {|row| row['sample_name'] == sname}
        @sample_info = @sample_row.to_h

        @short_attrs = @vis = [['sample_name', 'project_name', 'c_tumor_stage', 'c_tumor_grade', 'c_sample_histology', 'c_race', 'c_gender', 'n_age'], ['pfs', 'os', 'pfs_status', 'os_status', 'c_tumor_type', 'c_tumor_subtype', 'c_source_name', 'c_treatment']]


        #inf_name = "ACC_ALL.csv"
        #inf_url = File.join("/public/data/sample_plot/", inf_name)
        #inf_path = File.join($inf_dir, inf_name)
        #@inf_exist = (File.exist?(inf_path)) && (File.size(inf_path)>100)
        gon.push file: inf_url
    end

    def create
        @project = Project.find(params[:project_id])
        @sample = @project.samples.create(sample_params)
        @project.update_attribute(:number_of_samples, @project.samples.count)
        @sample.update_attribute(:project_name, @project.project_name)
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
        @project.update_attribute(:number_of_samples, @project.samples.count)
        redirect_to project_path(@project)
    end

    def edit
        @project = Project.find(params[:project_id])
        @sample = @project.samples.find(params[:id])
        @sample_attrs = Sample.column_names
    end
    
    def update
        @project = Project.find(params[:project_id])
        @sample = @project.samples.find(params[:id])
         
        if @sample.update(sample_params)
            redirect_to @project
        else
            render 'edit'
        end
    end

    def import
        @project = Project.find(params[:project_id])
        Sample.import(params[:file],params[:project_id] )
        @project.update_attribute(:number_of_samples, @project.samples.count)
        redirect_to project_path(@project), notice: "Samples imported."
    end

    def make_selected_file
        if params[:download_select]
            download_selected_samples
        elsif params[:download_filter]
            download_filtered_samples
        elsif params[:seqence]
            "nothing"
        elsif params[:seleted2ds]
            export_selected2dataset
        elsif params[:filter2ds]
            export_filtered2dataset 
        end
    end

    def export_filtered2dataset
        id = session[:user_id]
        @user = User.find(id)



        ds_name = params[:ds_selected]  
        @dataset = @user.datasets.find_by(name: ds_name)
        if params[:project_id]
            @project = Project.find(params[:project_id])
            ids = Sample.filtered(params[:search_value], @project)
            @dataset.add_samples(ids)
            redirect_to user_dataset_path(@user, @dataset)
        else
            ids = Sample.filtered(params[:search_value])
            @dataset.add_samples(ids)
            redirect_to user_dataset_path(@user, @dataset)

        end
         
    end
        

    def export_selected2dataset
        id = session[:user_id]
        @user = User.find(id)
        logger.error "=======>"
        logger.error @user
        logger.error params[:ds_selected]

        ds_name = params[:ds_selected]  
        @dataset = @user.datasets.find_by(name: ds_name)
        @dataset.add_samples(params[:selected_ids]) 
        if params[:project_id]
            @project = Project.find(params[:project_id])
            redirect_to user_dataset_path(@user, @dataset)
        else
            redirect_to user_dataset_path(@user, @dataset)
        end
        
    end

    def download_filtered_samples
        time = Time.now
        time_str = time.strftime("%Y_%m_%d")       
        time_str += ("_" + time.strftime("%k_%M")) 
        time_str = time_str.gsub(' ','')
        if params[:project_id]
            @project = Project.find(params[:project_id])
            ids = Sample.filtered(params[:search_value], @project)
            send_data Sample.selected_to_csv(ids), :filename => "#{time_str}_selected_metadata.csv"
        else
            ids = Sample.filtered(params[:search_value])
            send_data Sample.selected_to_csv(ids), :filename => "#{time_str}_selected_metadata.csv"
        end
    end

    def download_selected_samples
        time = Time.now
        time_str = time.strftime("%Y_%m_%d")       
        time_str += ("_" + time.strftime("%k_%M")) 
        time_str = time_str.gsub(' ','')
        @samples = Sample.order(:sample_name)
        send_data @samples.selected_to_csv(params[:selected_ids]), :filename => "#{time_str}_selected_metadata.csv"
    end

    def download_filter_inf
        time = Time.now
        time_str = time.strftime("%Y_%m_%d")       
        time_str += ("_" + time.strftime("%k_%M")) 
        time_str = time_str.gsub(' ','')
        if params[:project_id]
            @project = Project.find(params[:project_id])
            ids = Sample.filtered(params[:search_value], @project)
            send_data Sample.selected_inf_to_tsv(ids, option={"pj_name": @project.project_name}), :filename => "#{time_str}_selected_inf.tsv"
        else
            ids = Sample.filtered(params[:search_value])
            send_data Sample.selected_inf_to_tsv(ids), :filename => "#{time_str}_selected_inf.tsv"
        end
    end

    def download_selected_inf_file
        time = Time.now
        time_str = time.strftime("%Y_%m_%d")       
        time_str += ("_" + time.strftime("%k_%M")) 
        time_str = time_str.gsub(' ','')
        if params[:project_id]
            @project = Project.find(params[:project_id])
            send_data Sample.selected_inf_to_tsv(params[:selected_ids], option={"pj_name": @project.project_name}), :filename => "#{time_str}_selected_inf.tsv"
            # redirect_to @project
        else
            send_data Sample.selected_inf_to_tsv(params[:selected_ids]), :filename => "#{time_str}_selected_inf.tsv"
            # redirect_to samples_path
        end
        
        
    end

    def download_selected_seq_file
        @project = Project.find(params[:project_id])
        params[:selected_ids].each do |id|
            @sample = @project.samples.find(id)
            n1 = @project.project_name
            n2 = @sample.sample_name
            send_file {"#{$seq_dir}/#{n1}_#{n2}.fasta"}

        end
    end

    def upload_inf
        @project = Project.find(params[:project_id])
        @sample = @project.samples.find(params[:id])
        n1 = @project.project_name
        n2 = @sample.sample_name
        up_file = params[:inf_file]
        uploader = AbdUploader.new("#{n1}_#{n2}")
        uploader.store!(up_file)
        redirect_to project_sample_path, notice: "infiltration data uploaded."
    end

    def download_seq
        @project = Project.find(params[:project_id])
        @sample = @project.samples.find(params[:id])
        n1 = @project.project_name
        n2 = @sample.sample_name
        file_current = "#{Rails.root}/app/data/seq/#{n1}_#{n2}.fasta"
        if File.file?(file_current)
            send_file(
            file_current,
                filename: "#{n1}_#{n2}.tsv",
            )
        else
            redirect_back fallback_location: @sample, notice: "File does NOT exist."
        end
    end

    def download_inf
        @project = Project.find(params[:project_id])
        @sample = @project.samples.find(params[:id])
        n1 = @project.project_name
        n2 = @sample.sample_name
        file_current = "#{$inf_dir}#{n1}_#{n2}.tsv"
        if File.file?(file_current)
            send_file(
            file_current,
                filename: "#{n1}_#{n2}.tsv",
            )
        else
            redirect_back fallback_location: @sample, notice: "File does NOT exist."
        end

    end

    def import_inf_table
        #redirect_to import_inf_table_project_samples_path(:project_id=>params[:project_id], :file=>params[:file])
        @project = Project.find(params[:project_id])
        n1 = @project.project_name
        up_file = params[:file]
        # uploader = AbdUploader.new(n1)
        # uploader.store!(up_file)
        if up_file.respond_to?(:read)
            data = up_file.read
            lines = data.split("\n")
            names = lines[0].chomp.split("\t") 
            n_sample = lines.length() - 1 #number of sample
            n_key = names.length() - 1
            pj_name = names[0]
            keys = names[1..n_key]
            i = 1
            all_json = {}
            while i < lines.length()
                line = lines[i]
                sample_info = line.split("\t")
                s_name = sample_info[0].chomp
                f_path = "#{$inf_dir}#{n1}_#{s_name}.tsv"
                f = File.open(f_path, "w")
                s = "#{n1}\t#{s_name}"
                keys.each_with_index do |k, index|
                    value =  sample_info[index + 1]
                    if value.to_f != 0
                        s += "\n"
                        s += "#{k}\t#{value}"
                    end
                end
                f.write(s)
                f.close
            end
        else
            logger.error "Bad file_data: #{up_file.class.name}: #{up_file.inspect}"
        end
        redirect_to '/admin', notice: "ALL immune infiltration data uploaded."
    end

    private
        def sample_params
            params.require(:sample).permit(:sample_name, :project_name)
        end
end
