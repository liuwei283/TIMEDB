class AdminController < ApplicationController
    http_basic_authenticate_with name: "admin", password: "Lovelace"
    $inf_dir = "#{Rails.root}/public/data/sample_plot/"
    $data_dir = "#{Rails.root}/public/"
    def index
        @projects = Project.order(:project_name)
        #@organs = Organ.order(:primary_site)
        @cancers = Cancer.order(:c_cancer_name)
        @ana_cate = AnalysisCategory.order(:name)
        @ac_attrs = AnalysisCategory.column_names
        @viz = Visualizer.order(:name)
        @viz_attrs = Visualizer.column_names
        @ana = Analysis.order(:name)
        @a_attrs = Analysis.column_names
    end

    def modify_sample_inf
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
                i+=1
                f.write(s)
                f.close
            end
        else
            logger.error "Bad file_data: #{up_file.class.name}: #{up_file.inspect}"
        end
        redirect_to '/admin', notice: "ALL immune infiltration data uploaded."
    end

    def update_samples_num_table
        #generate cancer type and their sample numbers
        @cancers = Cancer.order(:c_cancer_name)
        csf_path = "#{$data_dir}sample_num/cancer_samples.tsv"
        csf = File.open(csf_path, "w")
        s = "cancer_name\tsample_number"
        @cancers.each do |cancer|
            ct = cancer.c_cancer_name
            sn = cancer.number_of_samples
            s += "\n"
            s += "#{ct}\t#{sn}"
        end 
        csf.write(s)
        csf.close
        #generate project and their sample numbers
        @projects = Project.order(:project_name)
        psf_path = "#{$data_dir}sample_num/project_samples.tsv"
        psf = File.open(psf_path, "w")
        s = "project\tsample_number"
        @projects.each do |project|
            pn = project.project_name
            sn = project.number_of_samples
            s += "\n"
            s += "#{pn}\t#{sn}"
        end
        psf.write(s)
        psf.close

        redirect_to '/admin', notice: "ALL Projects/Cancer types with samples number files updated."
    end 

    #actually no need to do file integration here - cell data
    def make_analysis_cancer_files
        all_analysis_methods = [""] # add eight analysis method here for cell data
        @cancers = Cancer.order(:c_cancer_name)
        all_analysis_methods.each do |analysis_method|
            @cancers.each do |cancer|
                ctype = cancer.c_cancer_name
                cprojects = cancer.projects
                project_file_names = []
                cprojects.each do |project|
                    pname = project.project_name
                    analysis_project_file_name = p_name + '_' + analysis_method + '.csv'
                    project_file_names.push(analysis_project_file_name)
                end
                firstpname = project_file_names[0]
                firstFPath = "#{$ovv_dir}analysis/#{analysis_method}/projects/#{firstpname}"
                ana_headers = CSV.open(firstFPath, &:readline)

                analysis_cancer_name = ctype + "_" + analysis_method + ".csv"
                cfile_path = "#{$ovv_dir}analysis/#{analysis_method}/cancers/#{analysis_cancer_name}"
                CSV.open(cfile_path, "wb", write_headers: true, headers: ana_headers) do |csv|
                    project_file_names.each do |ppath|  # for each of your csv files
                        absPath = "#{$ovv_dir}analysis/#{analysis_method}/projects/#{ppath}"
                        CSV.foreach(absPath, headers: true, return_headers: false) do |row| # don't output the headers in the rows
                            csv << row # append to the final file
                        end
                    end
                end
            end
        end
    end


    def make_subtype_cancer_files
        # integrate project data to cancer data
        # for subtype data, we will only have the C1-C6 now
        all_subtype_methods = ["C1-C6"] # add eight subtype method here
        cancers = Cancer.order(:c_cancer_name)
        all_subtype_methods.each do |subtype_method|

            cancers.each do |cancer|
                ctype = cancer.c_cancer_name
                cprojects = cancer.projects
                firstpname = cprojects.first.project_name
                firstFName =  firstpname + '_' + subtype_method + '.csv' 
                firstFPath = "#{$data_dir}subtype/#{subtype_method}/project/#{firstFName}"
                sub_headers = CSV.open(firstFPath, &:readline)

                subtype_cancer_name = ctype + '_' + subtype_method + ".csv"
                cfile_path = "#{$data_dir}subtype/#{subtype_method}/cancer/#{subtype_cancer_name}"
                CSV.open(cfile_path, "wb", write_headers: true, headers: sub_headers) do |csv|
                    cprojects.each do |project|  # for each of your csv files
                        pname = project.project_name
                        csv << [pname]
                        fname = pname + '_' + subtype_method + '.csv' 
                        fpath = "#{$data_dir}subtype/#{subtype_method}/project/#{fname}"
                        CSV.foreach(fpath, headers: true, return_headers: false) do |row| # don't output the headers in the rows
                            csv << row # append to the final file
                        end
                    end
                end
            end

            #integrate all TCGA projects to a single file
            fnameTCGA = subtype_method + '_TCGA_all.csv'
            fpathTCGA = "#{$data_dir}subtype/#{subtype_method}/#{fnameTCGA}"
            firstctype = cancers.first.c_cancer_name
            firstTCGAfname = "TCGA_" + firstctype + '_' + subtype_method  + ".csv"
            firstTCGAfpath = "#{$data_dir}subtype/#{subtype_method}/project/#{firstTCGAfame}"
            sub_headers = CSV.open(firstTCGAfpath, &:readline)

            CSV.open(fpathTCGA, "wb", write_headers: true, headers: sub_headers) do |csv|
                cancers.each do |cancer|
                    ctype = cancer.c_cancer_name
                    fname = "TCGA_" + ctype + '_' + subtype_method  + ".csv"
                    fpath = "#{$data_dir}subtype/#{subtype_method}/project/#{fname}"
                    csv << [ctype]
                    CSV.foreach(fpath, headers: true, return_headers: false) do |row|
                        csv << row
                    end
                end
            end
        end
    end

    def update_columns
        projects = Project.all
        cancers = Cancer.all

        #automatically calculatethe empty or to-be-updated columns 
        projects.each do |project|

            #number of genes
            file_name = project.project_name + ".csv"
            file_path = "#{$data_dir}RNA/visualization/" + file_name
            num_gene = CSV.foreach(file_path, headers: true).count
            project.update_attribute(:num_of_genes, num_gene)

            #number of samples
            project.update_attribute(:num_of_samples, project.samples.count)

        end

        #update the numnber of projets for cancers
        cancers.each do |cancer|

            #update the number of projects
            cancer.update_attribute(:number_of_related_projects, cancer.projects.count)

            #update the number of samples
            num_samples = 0
            projects_of_cancer = cancer.projects
            projects_of_cancer.each do |project|
                num_samples += project.samples.count
            end
            cancer.update_arrtribute(:number_of_samples, num_samples)


        end
    end

    def delete_samples
        up_file = params[:file]
        if up_file.respond_to?(:read)
            data = up_file.read
            lines = data.split("\n")
            lines.each do |line|
                id = line.chomp
                if Sample.exists? id
                    Sample.find(id).destroy
                end
            end

        else
            logger.error "Bad file_data: #{up_file.class.name}: #{up_file.inspect}"
        end
        redirect_to '/admin', notice: "Samples deleted."
    end

    def update_all_samples
        Sample.import(params[:file])
        cancers = Cancer.order(:c_cancer_name)
        cancers.each do |cancer|
            samples_num = 0
            cancers.projects.each do |project|
                samples_num += project.number_of_samples
            end
            cancer.update_attribute(:number_of_samples, samples_num)
        end
        redirect_to '/admin', notice: "Samples imported."
    end


    #consider delete later
    def update_all_organs
        Organ.import(params[:file])
        redirect_to '/admin', notice: "Organs imported."
    end

    def update_all_cancers
        Cancer.import(params[:file])
        redirect_to '/admin', notice: "Cancers imported."
    end

    def modify_viz
        Visualizer.import(params[:file])
        redirect_to '/admin', notice: "Visualization imported."
    end

    def modify_ana_cate
        AnalysisCategory.import(params[:file])
        redirect_to '/admin', notice: "Analysis category imported."
    end
    
    def modify_ana
        Analysis.import(params[:file])
        redirect_to '/admin', notice: "Analysis module imported."
    end

    def add_img
        file = params[:image_file]
        @filename = file.original_filename
        File.open("#{Rails.root}/app/assets/images/#{@filename}", "wb") do |f|
            f.write(file.read)
        end
        redirect_to '/admin', notice: "Image added."
    end

    def modify_viz_source
        VizDataSource.import(params[:file])
        redirect_to '/admin', notice: "Visualization source imported."
    end
end

